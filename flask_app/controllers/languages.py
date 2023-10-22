from flask import jsonify, redirect, request, session
from flask_app import app
from flask_app.models.language import Language

@app.route('/languages', methods=['GET'])
def languages():
    languages = Language.get_all_languages()
    return jsonify(languages), 200

@app.route('/languages/<int:language_id>', methods=['GET'])
def language(language_id):
    data = {'id': language_id}
    language = Language.get_language_by_id(data)
    return jsonify(language.to_json()), 200

# @app.route('/languages', methods=['GET'])
# def languages():
#     languages = Language.get_all_languages()
#     language_dicts = [language.to_dict() for language in languages]
#     return jsonify(language_dicts), 200

@app.route('/languages/user/<int:user_id>', methods=['GET'])
def language_by_user_id(user_id):
    data = {'id': user_id}
    language = Language.get_language_by_user_id(data)
    return jsonify([language.to_json() for language in language]), 200

@app.route('/add_language', methods=['POST'])
def create_language():
    data = {
        'language': request.json['language'],
        'intensity': request.json['intensity'],
        'user_id': request.json['user_id']
    }
    language_id = Language.save_language(data)
    return jsonify({'success': True, 'language_id': language_id}), 200

@app.route('/languages/<int:language_id>', methods=['PUT'])
def update_language(language_id):
    data = {
        'id': language_id,
        'language': request.json['language'],
        'intensity': request.json['intensity'],
    }
    Language.update_language(data)
    return jsonify({'success': True}), 200

@app.route('/languages/<int:language_id>', methods=['DELETE'])
def delete_language(language_id):
    data = {'id': language_id}
    Language.delete_language(data)
    return jsonify({'success': True}), 200

@app.route('/languages/<int:language_id>/add_user', methods=['POST'])
def add_user_to_language(language_id):
    data = {
        'user_id': request.json['user_id'],
        'language_id': language_id
    }
    Language.add_user(data)
    return jsonify({'success': True}), 200

@app.route('/languages/<int:language_id>/remove_user', methods=['POST'])
def remove_user_from_language(language_id):
    data = {
        'user_id': request.json['user_id'],
        'language_id': language_id
    }
    Language.remove_user(data)
    return jsonify({'success': True}), 200


