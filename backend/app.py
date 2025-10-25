from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import text
from models import SessionLocal, Message

# ===============================
# ⚙️ Flask App Setup
# ===============================
app = Flask(__name__)
CORS(app)  # frontend (port 5500) ↔ backend (port 5001) холболт

# ===============================
# 💬 1. Messages API (хуульчдын чат)
# ===============================
@app.route("/api/messages", methods=["GET", "POST"])
def handle_messages():
    db = SessionLocal()

    # 📨 POST хүсэлт (шинэ мессеж илгээх)
    if request.method == "POST":
        data = request.get_json() or {}
        sender = (data.get("sender") or "Guest").strip()
        content = (data.get("content") or "").strip()
        room = (data.get("room") or "general").strip().lower()

        # Хоосон мессеж шалгах
        if not content:
            db.close()
            return jsonify({"error": "Empty message"}), 400

        # Хэрэглэгчийн мессеж хадгалах
        db.add(Message(sender=sender, content=content, room=room))
        db.commit()

        # 🤖 Bot хариу
        bot_reply = generate_bot_reply(content)
        if bot_reply:
            db.add(Message(sender="bot", content=bot_reply, room=room))
            db.commit()

        db.close()
        return jsonify({"status": "ok"}), 201

    # 💬 GET хүсэлт (өрөөний мессежүүдийг авах)
    room = request.args.get("room", "general")
    messages = (
        db.query(Message)
        .filter(Message.room == room)
        .order_by(Message.sent_at.desc())
        .limit(50)
        .all()
    )
    db.close()

    return jsonify([
        {
            "id": m.id,
            "sender": m.sender,
            "content": m.content,
            "room": m.room,
            "sent_at": m.sent_at
        } for m in reversed(messages)
    ])


# ===============================
# 🤖 2. Bot Logic (reply generator)
# ===============================
def generate_bot_reply(text: str) -> str:
    t = (text or "").lower()
    if any(k in t for k in ["гэрээ", "contract", "гэрээг"]):
        return "📜 Гэрээний загвар, зөвлөгөө авах бол LegalTechHub-ийн 'Гэрээ' хэсгийг ашиглана уу."
    if any(k in t for k in ["татвар", "tax"]):
        return "💰 Татварын зөвлөгөөг 'О.Ганзориг' хуульчаас авах боломжтой."
    if any(k in t for k in ["эрүү", "criminal", "эрүүгийн"]):
        return "⚖️ Эрүүгийн эрх зүйн асуудлаар 'Б.Энхжин' хуульч тусална."
    if any(k in t for k in ["компани", "company"]):
        return "🏢 Компанийн эрх зүйн талаар 'Д.Ариунболд' хуульч тусална."
    if any(k in t for k in ["оюуны өмч", "patent", "trademark"]):
        return "🧠 Оюуны өмчийн асуудлаар 'Ц.Уранчимэг' хуульчтай холбогдоно уу."
    if any(k in t for k in ["баярлалаа", "thanks", "thank you"]):
        return "🤝 Танд баярлалаа. LegalTechHub танд туслахад бэлэн!"
    if any(k in t for k in ["сайн байна уу", "hello", "hi"]):
        return "👋 Сайн байна уу! Ямар төрлийн хуулийн тусламж хэрэгтэй вэ?"
    return "💬 Таны асуултыг хүлээн авлаа. Манай LegalTechHub танд туслах болно."


# ===============================
# 📝 3. Notes API (хуульчийн тэмдэглэл)
# ===============================
@app.route("/api/notes", methods=["GET"])
def get_notes():
    db = SessionLocal()
    rows = db.execute(text(
        "SELECT id, title, content, created_at FROM notes_note ORDER BY id DESC;"
    )).fetchall()
    db.close()
    return jsonify([{
        "id": r.id,
        "title": r.title,
        "content": r.content,
        "created_at": r.created_at.isoformat() if r.created_at else None
    } for r in rows])


@app.route("/api/notes/new", methods=["POST"])
def add_note():
    data = request.get_json() or {}
    title = (data.get("title") or "").strip()
    content = (data.get("content") or "").strip()

    if not title or not content:
        return jsonify({"error": "title/content required"}), 400

    db = SessionLocal()
    db.execute(text(
        "INSERT INTO notes_note (title, content) VALUES (:t, :c)"
    ), {"t": title, "c": content})
    db.commit()
    db.close()
    return jsonify({"message": "📝 Note added successfully"})


# ===============================
# 🚀 App run
# ===============================
if __name__ == "__main__":
    app.run(debug=True, port=5001)