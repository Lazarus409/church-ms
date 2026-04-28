from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, members, attendance, dashboard

app = FastAPI(title="Church MS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(members.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)

@app.get("/")
def root():
    return {"message": "Church MS API is running"}