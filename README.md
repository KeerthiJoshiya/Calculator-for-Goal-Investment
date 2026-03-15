 Goal-Based Investment Calculator

## Overview

This project is an interactive financial calculator developed for the **FinCal Innovation Hackathon (TECHNEX'26)**.

The calculator helps users estimate the **monthly investment (SIP) required to achieve a future financial goal** such as buying a house, education planning, or travel.

The tool adjusts the goal value based on inflation and calculates the required monthly investment using standard financial formulas.

The objective of this project is to **improve financial literacy and make investment planning easier and more interactive for users.**



## Features

• Calculate the future value of a financial goal
• Estimate the required monthly SIP investment
• Adjustable financial assumptions (inflation, return rate, years)
• Interactive investment growth charts
• Clear goal summary panel
• Responsive design for desktop, tablet, and mobile devices


## Financial Logic

### Step 1 – Future Goal Value

The future cost of the goal is calculated using the inflation formula:

Future Value (FV) = Present Cost × (1 + Inflation Rate)^Years

This adjusts the goal cost based on the expected inflation over the selected time period.

### Step 2 – Required Monthly SIP

The required SIP amount is calculated using the SIP formula:

Required SIP = FV × r ÷ [((1 + r)^n − 1) × (1 + r)]

Where:

FV = Inflated goal value
r = Monthly return rate (annual return ÷ 12)
n = Total number of months (years × 12)

This formula calculates the monthly investment needed to reach the goal value.


## User Inputs

The calculator allows users to input the following values:

• Current cost of the goal
• Years to achieve the goal
• Expected annual inflation rate
• Expected annual investment return

These inputs help simulate a realistic investment plan.


## Technology Stack

Frontend:
• Next.js
• React.js
• Tailwind CSS

Visualization:
• Chart.js

Version Control:
• GitHub


## Accessibility and Responsiveness

The calculator is designed to work across multiple devices:

• Desktop
• Tablet
• Mobile

The UI is structured using semantic HTML and responsive layouts to improve accessibility.


## Assumptions

• Investment returns remain constant during the investment period
• Inflation rate remains stable over time
• Investments are made monthly through SIP
• Calculations are for educational purposes and illustrative planning only


## Disclaimer

This tool has been designed for information purposes only. Actual results may vary depending on various factors involved in capital markets. Investors should not consider the above as a recommendation for any schemes of HDFC Mutual Fund. Past performance may or may not be sustained in the future and is not a guarantee of future returns.

Example:

Home Page
Calculator Interface
Investment Results Panel
Growth Chart Visualization

## Repository

GitHub Repository:
(https://github.com/KeerthiJoshiya/Calculator-for-Goal-Investment.git)

# Conclusion

This project demonstrates how financial planning tools can be made more intuitive and interactive using modern web technologies. The calculator aims to simplify investment decision-making and improve financial awareness among users.
