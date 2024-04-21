s = c("AL", "KY", "OH", "AK", "LA", "OK", "AZ", "ME", "OR", 
      "AR", "MD", "PA", "MA", "CA", "MI", "RI", "CO", "MN", 
      "SC", "CT", "MS", "SD", "DE", "MO", "TN", "MT", "TX", 
      "FL", "NE", "GA", "NV", "UT", "NH", "VT", "HI", "NJ", 
      "VA", "ID", "NM", "IL", "NY", "WA", "IN", "NC", "WV", 
      "IA", "ND", "WI", "KS", "WY")

# Walkability by State
W = read.csv("R Input/Walkability.csv", na.strings = "", 
             col.names = c("State", "Walkability", "Area"))
W = na.omit(W)
n = nchar(W[,1])
W[1] = substr(W[,1], n - 1, n)
W = W[W[,1] %in% s,]

# Bank Failures by State Since 2000
FB = read.csv("R Input/banklist.csv")
FB = FB[c(3, 6)]
n = nchar(FB[,2])
FB[2] = strtoi(substr(FB[,2], n - 1, n), 10) + 2000
State_vec = c()
fails_vec = c()
Year_vec = c()
for (state in s) {
  for (year in 2000:2023) {
    fails_vec = c(fails_vec, nrow(FB[FB[,1] == state & 
                                       FB[,2] == year,]))
    State_vec = c(State_vec, state)
    Year_vec = c(Year_vec, year)
  }
}
FB = data.frame(State = State_vec, Bank_Failures = fails_vec, 
                Year = Year_vec)
colnames(FB)[2] = "Bank Failures"

# Heath Data
H = read.csv("R Input/health.csv")
H = H[c(1, 3, 11, 27)]
H = na.omit(H)
H = H[,c(2, 1, 3, 4)]
H = H[H[,1] %in% s,]
H = H[order(H[,3]),]
colnames(H) = c("State", "Year", "Placeholder", "Placeholder")

# Fruit Deficient Adults (%)
Q1 = H[H[,4] == "Q018", -4]
colnames(Q1)[3] = "Fruit Deficient Adults (%)"

# Vegetable Deficient Adults (%)
Q2 = H[H[,4] == "Q019", -4]
colnames(Q2)[3] = "Vegetable Deficient Adults (%)"

# Obese Adults (%)
Q3 = H[H[,4] == "Q036", -4]
colnames(Q3)[3] = "Obese Adults (%)"

# Overweight Adults (%)
Q4 = H[H[,4] == "Q037", -4]
colnames(Q4)[3] = "Overweight Adults (%)"

# Adults who Exercise (%)
Q5 = H[H[,4] == "Q043", -4]
colnames(Q5)[3] = "Adults who Exercise Moderately(%)"

# Adults who Exercise and Lift (%)
Q6 = H[H[,4] == "Q044", -4]
colnames(Q6)[3] = "Adults who Exercise Moderately and Lift Weights (%)"

# Adults who Exercise a Lot (%)
Q7 = H[H[,4] == "Q045", -4]
colnames(Q7)[3] = "Adults who Exercise Often (%)"

# Adults who Lift (%)
Q8 = H[H[,4] == "Q046", -4]
colnames(Q8)[3] = "Adults who Lift Weights (%)"

# Adults who Engage in No Leisure-time Exercise (%)
Q9 = H[H[,4] == "Q047", -4]
colnames(Q9)[3] = "Adults who Engage in No Leisure-time Exercise (%)"

path = "" # File path removed for security purposes
write.csv(W, paste(path, "Walkability.csv", sep = ""), row.names = FALSE)
write.csv(FB, paste(path, "Failed_Banks.csv", sep = ""), row.names = FALSE)
write.csv(Q1, paste(path, "Fruit.csv", sep = ""), row.names = FALSE)
write.csv(Q2, paste(path, "Vegetable.csv", sep = ""), row.names = FALSE)
write.csv(Q3, paste(path, "Obese.csv", sep = ""), row.names = FALSE)
write.csv(Q4, paste(path, "Overweight.csv", sep = ""), row.names = FALSE)
write.csv(Q5, paste(path, "Exercise.csv", sep = ""), row.names = FALSE)
write.csv(Q6, paste(path, "Excerise_Lift.csv", sep = ""), row.names = FALSE)
write.csv(Q7, paste(path, "Excerise_More.csv", sep = ""), row.names = FALSE)
write.csv(Q8, paste(path, "Lift.csv", sep = ""), row.names = FALSE)
write.csv(Q9, paste(path, "Sedentary.csv", sep = ""), row.names = FALSE)
