from sqlalchemy import Column, Integer, String, Text, DateTime, func, create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv
import os

# ✅ .env файлыг гар аргаар ачаалж байна
dotenv_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path)

Base = declarative_base()


# ✅ .env-ээс DATABASE_URL-г уншина
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("❌ DATABASE_URL not loaded from .env — please check your .env path.")

# ✅ SQLAlchemy engine ба session үүсгэх
engine = create_engine(DATABASE_URL, echo=False)
SessionLocal = sessionmaker(bind=engine)

# ✅ Хүснэгтүүдийг үүсгэх
Base.metadata.create_all(bind=engine)
class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender = Column(String(50))
    content = Column(Text)
    sent_at = Column(DateTime(timezone=True), server_default=func.now())
    room = Column(String(50), server_default="general", nullable=False)  # ⬅️ нэмэгдлээ