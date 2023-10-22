from flask import jsonify, redirect, request, session
from flask_app import app
from flask_app.models.user import User
from flask_bcrypt import Bcrypt
bcrypt = Bcrypt(app)

@app.route('/register', methods=['POST'])
def register():
    # Validate input data
    errors = User.validate_user_register(request.json)
    if errors:
        print(errors)
        return jsonify(errors), 400
    
    # Hash password
    pw_hash = bcrypt.generate_password_hash(request.json['password'])

    # Create user
    user_data = {
        'first_name': request.json['first_name'],
        'last_name': request.json['last_name'],
        'user_language': request.json['user_language'],
        'email': request.json['email'],
        'password': pw_hash
    }

    user_id = User.save(user_data)

    # Redirect to dashboard page
    return jsonify({'success': True, 'user_id': user_id}), 200
    



@app.route('/login', methods=['POST'])
def login(): 

    errors = User.validate_user_login(request.json)
    if errors:
        return jsonify(errors), 400

    data = {"email": request.json['email']}

    user = User.get_by_email(data)
    user_id = user.id
    print(f'user id: {user_id}')

    if not user:
        return jsonify({'success': False, 'message': 'Email not found'}), 400
    if not bcrypt.check_password_hash(user.password, request.json['password']):
        return jsonify({'success': False, 'message': 'Incorrect password'}), 400
    return jsonify({'success': True, 'user_id': user_id}), 200

@app.route('/users/<int:user_id>', methods=['GET'])
def user(user_id):
    data = {'id': user_id}
    user = User.get_by_id(data)
    return jsonify(user.to_json()), 200

@app.route('/users/<int:user_id>', methods=['PUT'])
def update_user(user_id):
    errors = User.validate_user_edit(request.json)
    print(request.json)
    if errors:
        print(errors)
        return jsonify(errors), 400
    data = {
        'id': user_id,
        'first_name': request.json['first_name'],
        'last_name': request.json['last_name'],
        'user_language': request.json['user_language'],
        'email': request.json['email']
    }
    User.update(data)
    return jsonify({'success': True}), 200


@app.route('/logout_session', methods=['DELETE'])
def logout(): 
    session.clear()
    return jsonify({'message': 'Session logged out successfully'})
