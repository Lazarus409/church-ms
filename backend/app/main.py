from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, members, attendance, dashboard, export, new_members

app = FastAPI(title="Church MS API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://church-ms-seven.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(members.router)
app.include_router(attendance.router)
app.include_router(dashboard.router)
app.include_router(export.router)
app.include_router(new_members.router)

@app.get("/")
def root():
    return {"message": "Church MS API is running"}