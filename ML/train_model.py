import pandas as pd
from sklearn.linear_model import LinearRegression
import pickle

df = pd.read_csv('train.csv')

X = df[['LotArea', 'YearBuilt', 'OverallQual', 'OverallCond']]
y = df['SalePrice']

model = LinearRegression()
model.fit(X, y)

with open("house_price_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved as house_price_model.pkl")