from flask import jsonify, request
from flask_app import app
from flask_app.models.flashcard import Flashcard
# from flask import Response
from flask import jsonify

@app.route('/flashcards', methods=['GET'])
def flashcards():
    flashcards = Flashcard.get_all_flashcards()
    return jsonify(flashcards), 200

@app.route('/flashcards/<int:flashcard_id>', methods=['GET'])
def flashcard(flashcard_id):
    data = {'id': flashcard_id}
    flashcard = Flashcard.get_flashcard_by_id(data)
    return jsonify(flashcard), 200

@app.route('/flashcards/word/<string:word>', methods=['GET'])
def flashcard_by_word(word):
    data = {'word': word}
    flashcard = Flashcard.get_flashcard_by_word(data)
    return jsonify(flashcard), 200

@app.route('/flashcards/user/<int:user_id>', methods=['GET'])
def saved_flashcards_by_user(user_id):
    data = {'id': user_id}
    flashcards = Flashcard.get_saved_flashcard_by_user_id(data)
    return jsonify(flashcards), 200

@app.route('/add_flashcard', methods=['POST'])
def create_flashcard():
    data = {
        'word': request.json['word'],
        'pronunciation': request.json['pronunciation'],
        'translation': request.json['translation'],
        'definition': request.json['definition'],
        'image': request.json['image'],
        'saved': request.json['saved'],
        'user_id': request.json['user_id'],
        'language_id': request.json['language_id']
    }
    flashcard_id = Flashcard.save_flashcard(data)
    return jsonify({'success': True, 'flashcard_id': flashcard_id}), 200

@app.route('/flashcards/<int:flashcard_id>', methods=['PUT'])
def update_flashcard(flashcard_id):
    data = {
        'id': flashcard_id,
        'word': request.json['word'],
        'pronunciation': request.json['pronunciation'],
        'translation': request.json['translation'],
        'definition': request.json['definition'],
        'image': request.json['image'],
        'saved': request.json['saved']
    }
    Flashcard.update_flashcard(data)
    return jsonify({'success': True}), 200

@app.route('/flashcards/<int:flashcard_id>', methods=['DELETE'])
def delete_flashcard(flashcard_id):
    data = {'id': flashcard_id}
    Flashcard.delete_flashcard(data)
    return jsonify({'success': True}), 200

@app.route('/flashcards/user/<int:user_id>/language/<int:language_id>', methods=['GET'])
def language_word_by_user(user_id, language_id):
    data = {
        'user_id': user_id,
        'language_id': language_id
    }
    print("DATA", data)
    flashcards_word = Flashcard.get_all_words(data)
    print("FLASHCARDS WORD", flashcards_word)
    return jsonify(flashcards_word), 200


# @app.route('/api/narakeet/<path:path>', methods=['GET', 'POST'])
# def proxy_narakeet(path):
#     narakeet_url = f'https://api.narakeet.com/{path}'
#     if request.method == 'GET':
#         response = requests.get(narakeet_url, headers=request.headers, stream=True)
#     elif request.method == 'POST':
#         response = requests.post(
#             narakeet_url,
#             headers=request.headers,
#             data=request.get_data(),
#             cookies=request.cookies,
#             stream=True
#         )
#     else:
#         return jsonify({'error': 'Invalid HTTP method'}), 400

#     return Response(
#         response=response.content,
#         status=response.status_code,
#         headers=dict(response.headers),
#         content_type=response.headers['content-type'],
#     )

# app route URL get new word from API localhost:5000/flashcards/new_word/API
# run url_API() in python
# if word is not in database, add it to database else run the function again
# if picture is not there, send empty string
# check if the info is in the language you want/pronuctiation style
# Bonus: Add audio to the word
# When everything is done, send the word to the front end


