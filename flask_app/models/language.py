from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.models.base_model import BaseModel
import json

class Language(BaseModel):
    json_fields = ['id', 'language', 'intensity', 'created_at', 'updated_at']
    def __init__( self , data ):
        self.id = data['id']
        self.language = data['language']
        self.intensity = data['intensity']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']
        self.users = []

    @classmethod
    def get_all_languages(cls):
        query = "SELECT * FROM languages;"
        results = connectToMySQL('MultiLingo').query_db(query)
        languages = []
        for language in results:
            languages.append(cls(language))
        return languages
    
    @classmethod
    def get_language_by_id(cls, data):
        query = "SELECT * FROM languages WHERE id = %(id)s;"
        results = connectToMySQL('MultiLingo').query_db(query, data)
        return cls(results[0])
    
    @classmethod
    def get_language_by_name(cls, data):
        query = "SELECT * FROM languages WHERE language = %(language)s;"
        results = connectToMySQL('MultiLingo').query_db(query, data)
        return cls(results[0])
    
    @classmethod
    def get_language_by_user_id(cls, data):
        query = """ 
                SELECT * FROM languages
                WHERE languages.user_id = %(id)s;
            """
        results = connectToMySQL('MultiLingo').query_db(query, data)
        languages = []
        for language in results:
            languages.append(cls(language))
        return languages
    
    @classmethod
    def save_language(cls, data):
        query = "INSERT INTO languages (language, intensity, user_id, created_at, updated_at) VALUES (%(language)s, %(intensity)s, %(user_id)s, NOW(), NOW());"
        return connectToMySQL('MultiLingo').query_db(query, data)
    
    @classmethod
    def update_language(cls, data):
        query = "UPDATE languages SET intensity = %(intensity)s, updated_at = NOW() WHERE id = %(id)s;"
        return connectToMySQL('MultiLingo').query_db(query, data)
    
    @classmethod
    def delete_language(cls, data):
        # Delete the related flashcards first
        flashcard_query = "DELETE FROM flashcards WHERE language_id = %(id)s;"
        connectToMySQL('MultiLingo').query_db(flashcard_query, data)

        # Then delete the language
        language_query = "DELETE FROM languages WHERE id = %(id)s;"
        return connectToMySQL('MultiLingo').query_db(language_query, data)


    


