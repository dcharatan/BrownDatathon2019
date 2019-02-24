########## READ IN CDC DATA ##########

## load necessary packages ## 

library(readr)
library(tibble)
library(dplyr)



## designate and set working directories ## 

dir.data <- "/Users/danielcohen/Desktop/Brown Datathon/Data"
dir.vis <- "/Users/danielcohen/Desktop/Brown Datathon/Visualizations"

setwd(dir.data)



## read in data ## 

# read in variables data, use for starts, names, ends vectors  

start_yr <- 2004
end_yr <- 2017
num_years <- end_yr - start_yr
df.list = list()

for (i in start_yr:end_yr) {
  variables_name = paste0("variables", i, ".csv")
  BRFSS_name = paste0("BRFSS", i, ".txt")
  num = i - start_yr + 1
  
  setwd(paste0(dir.data, "/Variables"))
  
  variables <- as.tibble(
    read.csv(variables_name, stringsAsFactors = F)
  ) 
  
  setwd(dir.data)
  
  starts = integer(nrow(variables))
  names = character(nrow(variables))
  ends = integer(nrow(variables))
  col_types = strrep("c", nrow(variables))
  
  for (j in 1:nrow(variables)) {
    starts[j] <- variables[[1]][j]
    names[j] <- variables[[2]][j]
    ends[j] <- variables[[1]][j] + (variables[[3]][j] - 1)
  }
  
  CDCbasic <- as.tibble(
    read_fwf(BRFSS_name
             , fwf_positions(
               starts,
               ends,
               names 
             )
             , col_types = col_types
    ) 
  ) %>%
    select(state = contains("_STATE"), seatbelt = contains("SEATBELT"), exercise = contains("EXERANY2")
           , smoke = contains("SMOKE100"), drink = contains("DRNKANY"), checkup = contains("CHECKUP")
           , healthcare = contains("HLTHPL"), weight = contains("WEIGHT"), height = contains("HEIGHT")) %>%
    mutate(year = i)
  
  df.list[[num]] <- CDCbasic
}

# for each df list, if it's missing one of the columns add a mock column 

for (i in 1:length(df.list)) {
  for (name in c("state", "seatbelt", "exercise", "smoke", "drink", "checkup", "healthcare", "weight", "height")) {
    if (!(name %in% colnames(df.list[[i]]))) {
      df.list[[i]][[name]] <- NA
    }
  }
}

# fix state1/state2 issue 

df.list[[9]] <- df.list[[9]] %>%
  select(-state) %>%
  mutate(state = state1) %>%
  select(-state1, -state2)

# reorder all tables 

for (tibble in df.list) {
  tibble <- tibble %>%
    select(state, year, seatbelt, exercise, smoke, drink, checkup, healthcare, weight, height)
}

# create aggregate table 

agg_table = tibble(state = "NA", year = NaN, seatbelt = "NA", exercise = "NA", smoke = "NA"
                   , drink = "NA", checkup = "NA", healthcare = "NA", weight = "NA", height = "NA")

# combine all tibbles into one tibble 

for (tibble in df.list) {
  agg_table <- rbind(agg_table, tibble)
}

agg_table <- agg_table %>%
  filter(!is.na(year)) %>%
  mutate(weight = as.integer(weight)) %>%
  mutate(height = as.integer(height))

# turn every column into the proper format 
# state, year, seatbelt, exercise, smoke, drink, checkup, healthcare, weight, height

state_codes = as.tibble(read.csv("state_codes.csv", stringsAsFactors = F)) %>% 
  mutate(Code = as.character(Code))

state_codes[['Code']][1:7] <- c("01", "02", "04", "05", "06", "08", "09")

seatbelt_codes = tibble(seatbelt = c("1", "2", "3", "4", "5"), seatbelt_score = c(5, 4, 3, 2, 1))

exercise_codes = tibble(exercise = c("1", "2"), exercise_score = c(1, 0))

smoke_codes = tibble(smoke = c("1", "2"), smoke_score = c(1, 0))

drink_codes = tibble(drink = c("1", "2"), drink_score = c(1, 0))

checkup_codes = tibble(checkup = c("1", "2", "3", "4"), checkup_score = c(4, 3, 2, 1))

healthcare_codes = tibble(healthcare = c("1", "2"), healthcare_score = c(1, 0))

# for weight, filter such that weight < 999
# for height, take all that are less than a thousand; hundreds digit is feet, tens/ones is inches

agg_table_with_scores <- agg_table %>%
  left_join(state_codes, by = c("state" = "Code")) %>%
  left_join(seatbelt_codes, by = c("seatbelt")) %>%
  left_join(exercise_codes, by = c("exercise")) %>%
  left_join(smoke_codes, by = c("smoke")) %>%
  left_join(drink_codes, by = c("drink")) %>%
  left_join(checkup_codes, by = c("checkup")) %>%
  left_join(healthcare_codes, by = c("healthcare")) %>%
  filter(weight < 999) %>%
  filter(height < 1000) %>%
  mutate(height = (((height %/% 100) * 12) + (height %% 100)) / 12)

agg_table_with_scores <- agg_table_with_scores %>%
  select(state = State, year, seatbelt_score, exercise_score, smoke_score, drink_score, checkup_score
         , healthcare_score, weight, height)



## group by state and year ## 

grouped_seatbelt <- agg_table_with_scores %>%
  group_by(state, year) %>%
  filter(!is.na(seatbelt_score)) %>%
  summarize(seatbelt_avg = mean(seatbelt_score))

grouped_exercise <- agg_table_with_scores %>%
  group_by(state, year) %>%
  filter(!is.na(exercise_score)) %>%
  summarize(exercise_avg = mean(exercise_score))

grouped_smoke <- agg_table_with_scores %>%
  group_by(state, year) %>%
  filter(!is.na(smoke_score)) %>%
  summarize(smoke_avg = mean(smoke_score))

grouped_drink <- agg_table_with_scores %>%
  group_by(state, year) %>%
  filter(!is.na(drink_score)) %>%
  summarize(drink_avg = mean(drink_score))

grouped_checkup <- agg_table_with_scores %>%
  group_by(state, year) %>%
  filter(!is.na(checkup_score)) %>%
  summarize(checkup_avg = mean(checkup_score))

grouped_healthcare <- agg_table_with_scores %>%
  group_by(state, year) %>%
  filter(!is.na(healthcare_score)) %>%
  summarize(healthcare_avg = mean(healthcare_score))

grouped_weight <- agg_table_with_scores %>%
  group_by(state, year) %>%
  filter(!is.na(weight)) %>%
  summarize(weight_avg = mean(weight))

grouped_height <- agg_table_with_scores %>%
  group_by(state, year) %>%
  filter(!is.na(height)) %>%
  summarize(height_avg = mean(height))

grouped <- grouped_seatbelt %>%
  full_join(grouped_exercise, by= c("state", "year")) %>%
  full_join(grouped_smoke, by= c("state", "year")) %>%
  full_join(grouped_drink, by= c("state", "year")) %>%
  full_join(grouped_checkup, by= c("state", "year")) %>%
  full_join(grouped_healthcare, by= c("state", "year")) %>%
  full_join(grouped_weight, by= c("state", "year")) %>%
  full_join(grouped_height, by= c("state", "year")) %>%
  filter(!is.na(state)) %>%
  ungroup()
  
# interpolate 
i = 0;
getVal <- function(st, var, yr) {
  print(yr)
  if (yr > 2016) {
    return(grouped[grouped$year == yr & grouped$state == st,][[var]])
    }
  next_year_val <- grouped[grouped$year == yr & grouped$state == st,][[var]]
  print(next_year_val)
  if (is.na(next_year_val)) {
    return(getVal(st, var, yr + 1))
  }
  return(next_year_val)
}

states = rev(unique(agg_table_with_scores[!is.na(agg_table_with_scores$state),]$state))
years = c(2017:2005)

for (st in states) {
  for (yr in years) {
    if (nrow(grouped[grouped$year == yr & grouped$state == st,]) == 0) {
      grouped <- rbind(grouped, c(st, yr, NA, NA, NA, NA, NA, NA, NA, NA))
    }
  }
}

for (var in colnames(grouped)[3:10]) {
  print(var)
  for (st in states) {
    print(st)
    for (yr in years) {
      print(yr)
      if (is.na(grouped[grouped$year == yr & grouped$state == st,][[var]]) |
          length(grouped[grouped$year == yr & grouped$state == st,][[var]]) == 0) {
        grouped[grouped$year == yr & grouped$state == st,][[var]] <- getVal(st, var, yr)
      }
    }
  }
}



## add columns for change from previous year

new_grouped <- as.tibble(read.csv("final_interp_dataset.csv"))



## try statistical things ## 

# number of years smoking by state

CDCbasic %>% 
  filter(!is.na(COPDSMOK)) %>% 
  mutate(COPDSMOK = as.double(COPDSMOK)) %>% 
  filter(COPDSMOK <= 76) %>% 
  group_by(`_STATE`) %>% 
  summarize(smoke_fat_years = mean(COPDSMOK)) %>% 
  arrange(-smoke_fat_years)

# test regression 

