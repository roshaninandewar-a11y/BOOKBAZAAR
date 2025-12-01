from flask import Flask, render_template, request, jsonify, session, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import pymysql
import os

# Allow SQLAlchemy to use PyMySQL
pymysql.install_as_MySQLdb()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET', 'bookbazaar-secret-key-2024')
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:ROSHANI30@localhost/bookbazaar'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
CORS(app)


# ---------------- MODELS ----------------
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    phone = db.Column(db.String(20), nullable=True)
    location = db.Column(db.String(200), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    password = db.Column(db.String(200), nullable=False)
    is_admin = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    books = db.relationship('Book', backref='owner', lazy=True)
    rentals = db.relationship('Rental', backref='renter', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'location': self.location,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'is_admin': self.is_admin
        }


class Book(db.Model):
    __tablename__ = 'books'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    author = db.Column(db.String(100), nullable=False)
    genre = db.Column(db.String(50), nullable=True)
    description = db.Column(db.Text, nullable=True)
    cover = db.Column(db.String(500), nullable=True)
    price = db.Column(db.Integer, nullable=False, default=0)
    rating = db.Column(db.Float, default=0.0)
    available = db.Column(db.Boolean, default=True)
    location = db.Column(db.String(200), nullable=True)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    rentals = db.relationship('Rental', backref='book', lazy=True)

    def to_dict(self):
        owner = self.owner
        return {
            'id': self.id,
            'title': self.title,
            'author': self.author,
            'genre': self.genre,
            'description': self.description,
            'cover': self.cover or 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
            'price': self.price,
            'rating': self.rating,
            'available': self.available,
            'location': self.location,
            'latitude': self.latitude,
            'longitude': self.longitude,
            'owner': owner.name if owner else 'Unknown',
            'ownerContact': owner.phone if owner else '',
            'ownerEmail': owner.email if owner else ''
        }


class Rental(db.Model):
    __tablename__ = 'rentals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('books.id'), nullable=False)
    rental_date = db.Column(db.DateTime, default=datetime.utcnow)
    return_date = db.Column(db.DateTime, nullable=True)
    actual_return_date = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='active')
    payment_method = db.Column(db.String(50), nullable=True)

    def to_dict(self):
        if self.status == 'active' and self.return_date and datetime.utcnow() > self.return_date:
            self.status = 'overdue'
            db.session.commit()
        
        book_data = self.book.to_dict() if self.book else {}
        renter_data = self.renter.to_dict() if self.renter else {}
        
        return {
            'id': self.id,
            'user_id': self.user_id,
            'book_id': self.book_id,
            'rental_date': self.rental_date.strftime('%Y-%m-%d'),
            'return_date': self.return_date.strftime('%Y-%m-%d') if self.return_date else None,
            'status': self.status,
            'payment_method': self.payment_method,
            'renter_name': renter_data.get('name'),
            **book_data
        }


class ContactMessage(db.Model):
    __tablename__ = 'contact_messages'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    message = db.Column(db.Text, nullable=False)
    read = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'message': self.message,
            'read': self.read,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }


# ---------------- INITIALIZE DATABASE ----------------
def init_db():
    with app.app_context():
        db.create_all()

        if User.query.count() == 0:
            users = [
                User(
                    name='Admin User',
                    email='admin@bookbazaar.com',
                    phone='+911234567890',
                    location='Mumbai',
                    password=generate_password_hash('ROSHANI30'),
                    is_admin=True
                ),
                User(
                    name='Roshani Nandewar',
                    email='roshaninandewar@gmail.com',
                    phone='+918097951950',
                    location='Bandra, Mumbai',
                    latitude=19.0596,
                    longitude=72.8295,
                    password=generate_password_hash('password123')
                ),
                User(
                    name='Pramod Padol',
                    email='pramodpadol70@gmail.com',
                    phone='+919359995371',
                    location='Andheri, Mumbai',
                    latitude=19.1136,
                    longitude=72.8697,
                    password=generate_password_hash('password123')
                )
            ]
            db.session.add_all(users)
            db.session.commit()

        if Book.query.count() == 0:
            u1 = User.query.filter_by(email='roshaninandewar@gmail.com').first()
            u2 = User.query.filter_by(email='pramodpadol70@gmail.com').first()
            
            books = [
                Book(title='To Kill a Mockingbird', author='Harper Lee', genre='fiction',
                     description='A gripping tale of racial injustice and childhood innocence.',
                     cover='https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
                     price=50, rating=4.8, location='Andheri, Mumbai', 
                     latitude=19.1136, longitude=72.8697, owner_id=u2.id if u2 else 1),
                
                Book(title='Atomic Habits', author='James Clear', genre='self-help',
                     description='Transform your life with tiny changes.',
                     cover='https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400',
                     price=75, rating=4.9, location='Bandra, Mumbai',
                     latitude=19.0596, longitude=72.8295, owner_id=u1.id if u1 else 1),
                
                Book(title='Sapiens', author='Yuval Noah Harari', genre='non-fiction',
                     description='A brief history of humankind.',
                     cover='https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
                     price=60, rating=4.7, location='Powai, Mumbai',
                     latitude=19.1176, longitude=72.9060, owner_id=u2.id if u2 else 1),
                
                Book(title='The Alchemist', author='Paulo Coelho', genre='fiction',
                     description='Follow your dreams and listen to your heart.',
                     cover='https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
                     price=45, rating=4.6, location='Bandra, Mumbai',
                     latitude=19.0596, longitude=72.8295, owner_id=u1.id if u1 else 1),
                
                Book(title='Thinking, Fast and Slow', author='Daniel Kahneman', genre='non-fiction',
                     description='Explore the two systems that drive the way we think.',
                     cover='https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
                     price=70, rating=4.8, location='Andheri, Mumbai',
                     latitude=19.1136, longitude=72.8697, owner_id=u2.id if u2 else 1),
                
                Book(title='The Power of Now', author='Eckhart Tolle', genre='self-help',
                     description='A guide to spiritual enlightenment.',
                     cover='https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400',
                     price=55, rating=4.7, location='Bandra, Mumbai',
                     latitude=19.0596, longitude=72.8295, owner_id=u1.id if u1 else 1),
                
                Book(title='1984', author='George Orwell', genre='fiction',
                     description='Dystopian social science fiction.',
                     cover='https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=400',
                     price=40, rating=4.9, location='Mumbai Central',
                     owner_id=u2.id if u2 else 1),
                
                Book(title='The Art of War', author='Sun Tzu', genre='non-fiction',
                     description='Ancient Chinese military treatise.',
                     cover='https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
                     price=35, rating=4.5, location='Colaba, Mumbai',
                     owner_id=u1.id if u1 else 1),
                
                Book(title='Rich Dad Poor Dad', author='Robert Kiyosaki', genre='self-help',
                     description='What the rich teach their kids about money.',
                     cover='https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?w=400',
                     price=65, rating=4.7, location='Andheri, Mumbai',
                     owner_id=u2.id if u2 else 1),
                
                Book(title='The Subtle Art of Not Giving a F*ck', author='Mark Manson', genre='self-help',
                     description='A counterintuitive approach to living a good life.',
                     cover='https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
                     price=55, rating=4.6, location='Bandra, Mumbai',
                     owner_id=u1.id if u1 else 1)
            ]
            db.session.add_all(books)
            db.session.commit()

        print("✅ Database initialized with sample data!")


# ---------------- ROUTES ----------------

@app.route('/')
def index():
    return render_template('index.html')


# ---------- Auth APIs ----------
@app.route('/api/signup', methods=['POST'])
def api_signup():
    try:
        data = request.get_json() or {}
        required = ['name', 'email', 'password']
        for k in required:
            if not data.get(k):
                return jsonify({'error': f'{k} is required'}), 400

        if User.query.filter_by(email=data['email']).first():
            return jsonify({'error': 'Email already registered'}), 400

        user = User(
            name=data['name'],
            email=data['email'],
            phone=data.get('phone'),
            location=data.get('location'),
            password=generate_password_hash(data['password'])
        )
        db.session.add(user)
        db.session.commit()
        session['user_id'] = user.id
        return jsonify({'message': 'Signup successful', 'user': user.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/login', methods=['POST'])
def api_login():
    try:
        data = request.get_json() or {}
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'email and password required'}), 400

        user = User.query.filter_by(email=data['email']).first()
        if not user or not check_password_hash(user.password, data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401

        session['user_id'] = user.id
        return jsonify({'message': 'Login successful', 'user': user.to_dict()}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/logout', methods=['POST'])
def api_logout():
    session.pop('user_id', None)
    return jsonify({'message': 'Logged out'}), 200


# ---------- Books ----------
@app.route('/api/books', methods=['GET'])
def api_get_books():
    try:
        books = Book.query.order_by(Book.created_at.desc()).all()
        return jsonify({'books': [b.to_dict() for b in books]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/books', methods=['POST'])
def api_add_book():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        
        data = request.get_json() or {}
        required = ['title', 'author', 'price']
        for k in required:
            if not data.get(k):
                return jsonify({'error': f'{k} is required'}), 400

        book = Book(
            title=data['title'],
            author=data['author'],
            genre=data.get('genre', ''),
            description=data.get('description', ''),
            cover=data.get('cover'),
            price=int(data.get('price', 0)),
            location=data.get('location'),
            latitude=data.get('latitude'),
            longitude=data.get('longitude'),
            owner_id=session['user_id']
        )
        db.session.add(book)
        db.session.commit()
        return jsonify({'message': 'Book added', 'book': book.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/books/<int:book_id>', methods=['DELETE'])
def api_delete_book(book_id):
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        
        book = Book.query.get_or_404(book_id)
        user = User.query.get(session['user_id'])
        
        if book.owner_id != session['user_id'] and not user.is_admin:
            return jsonify({'error': 'Forbidden'}), 403
        
        db.session.delete(book)
        db.session.commit()
        return jsonify({'message': 'Book deleted'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


# ---------- Rentals (FIXED PAYMENT) ----------
@app.route('/api/rentals', methods=['POST'])
def api_create_rental():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        
        data = request.get_json() or {}
        rentals_data = data.get('rentals', [])
        
        if not rentals_data:
            return jsonify({'error': 'No rentals provided'}), 400
        
        created_rentals = []
        
        for rental_data in rentals_data:
            book_id = rental_data.get('id')
            book = Book.query.get(book_id)
            
            if not book:
                continue
            
            if not book.available:
                continue
            
            rent = Rental(
                user_id=session['user_id'],
                book_id=book.id,
                rental_date=datetime.utcnow(),
                return_date=datetime.utcnow() + timedelta(days=14),
                payment_method=rental_data.get('paymentMethod', 'upi')
            )
            book.available = False
            db.session.add(rent)
            created_rentals.append(rent)
        
        db.session.commit()
        return jsonify({
            'message': 'Rentals created successfully',
            'rentals': [r.to_dict() for r in created_rentals]
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/rentals', methods=['GET'])
def api_get_rentals():
    try:
        if 'user_id' not in session:
            return jsonify({'error': 'Unauthorized'}), 401
        
        rentals = Rental.query.filter_by(user_id=session['user_id']).order_by(Rental.rental_date.desc()).all()
        return jsonify({'rentals': [r.to_dict() for r in rentals]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ---------- Contact ----------
@app.route('/api/contact', methods=['POST'])
def api_contact():
    try:
        data = request.get_json() or {}
        required = ['name', 'email', 'message']
        for k in required:
            if not data.get(k):
                return jsonify({'error': f'{k} is required'}), 400
        
        msg = ContactMessage(
            name=data['name'],
            email=data['email'],
            message=data['message']
        )
        db.session.add(msg)
        db.session.commit()
        return jsonify({'message': 'Message received'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/messages', methods=['GET'])
def api_get_messages():
    try:
        messages = ContactMessage.query.order_by(ContactMessage.created_at.desc()).all()
        return jsonify({'messages': [m.to_dict() for m in messages]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ---------- Stats ----------
@app.route('/api/stats', methods=['GET'])
def api_stats():
    try:
        total_books = Book.query.count()
        total_users = User.query.count()
        total_rentals = Rental.query.count()
        active_rentals = Rental.query.filter_by(status='active').count()
        rentals = Rental.query.all()
        total_revenue = sum([r.book.price for r in rentals if r.book])
        
        return jsonify({
            'total_books': total_books,
            'total_users': total_users,
            'total_rentals': total_rentals,
            'active_rentals': active_rentals,
            'total_revenue': total_revenue
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ---------- Admin APIs ----------
@app.route('/api/admin/users', methods=['GET'])
def api_admin_users():
    try:
        users = User.query.all()
        users_data = []
        for user in users:
            user_dict = user.to_dict()
            user_dict['books_count'] = len(user.books)
            user_dict['joined'] = user.created_at.strftime('%Y-%m-%d')
            users_data.append(user_dict)
        
        return jsonify({'users': users_data}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/admin/rentals', methods=['GET'])
def api_admin_rentals():
    try:
        rentals = Rental.query.all()
        return jsonify({'rentals': [r.to_dict() for r in rentals]}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ---------------- Admin Panel (Web Pages) ----------------
@app.route('/admin')
def admin_page():
    return render_template('admin.html')


# ---------------- RUN ----------------
if __name__ == '__main__':
    init_db()
    app.run(debug=True, host='0.0.0.0', port=5000)