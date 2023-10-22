from flask_app.config.mysqlconnection import connectToMySQL
from flask_app.models.base_model import BaseModel
from flask import flash
import json
import re

password_regex = re.compile(r'^(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$')

EMAIL_REGEX = re.compile(r'^[a-zA-Z0-9.+_-]+@[a-zA-Z0-9._-]+\.[a-zA-Z]+$')

class User(BaseModel):

    json_fields = ['id', 'first_name', 'last_name', 'email', 'user_language', 'password', 'created_at', 'updated_at']
    def __init__( self , data ):
        self.id = data['id']
        self.first_name = data['first_name']
        self.last_name = data['last_name']
        self.email = data['email']
        self.user_language = data['user_language']
        self.password = data['password']
        self.created_at = data['created_at']
        self.updated_at = data['updated_at']

    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'user_language': self.user_language,
            'email': self.email,
            'password': self.password,
            'created_at': self.created_at,
            'updated_at': self.updated_at
        }

    @staticmethod
    def validate_user_register(data):
        errors = {}

        if len(data['first_name']) < 2:
            errors['first_name'] = "First name must be at least 2 characters long."
        if len(data['last_name']) < 2:
            errors['last_name'] = "Last name must be at least 2 characters long."
        if len(data['user_language']) < 1:
            errors['user_language'] = "Please select a language."
        if not EMAIL_REGEX.match(data['email']):
            errors['email'] = "Invalid email address!"
        if len(data['password']) < 8:
            errors['password'] = "Password must be at least 8 characters long."
        if data['password'] != data['confirm_password']:
            errors['confirm_password'] = "Passwords do not match!"

        return errors
    
    @staticmethod
    def validate_user_edit(data):
        errors = {}

        if len(data['first_name']) < 2:
            errors['first_name'] = "First name must be at least 2 characters long."
        if len(data['last_name']) < 2:
            errors['last_name'] = "Last name must be at least 2 characters long."
        if len(data['user_language']) < 1:
            errors['user_language'] = "Please select a language."
        if not EMAIL_REGEX.match(data['email']):
            errors['email'] = "Invalid email address!"

        return errors
    
    @staticmethod
    def validate_user_login(data):
        errors = {}

        if not EMAIL_REGEX.match(data['email']):
            errors['email'] = "Invalid email address!"
        if len(data['password']) < 8:
            errors['password'] = "Password must be at least 8 characters long."

        return errors
    

    
    @classmethod
    def get_all_users(cls):
        query = "SELECT * FROM users;"
        results = connectToMySQL('MultiLingo').query_db(query)
        users = []
        for user in results:
            users.append(cls(user))
        return users
    
    @classmethod
    def get_by_id(cls, data):
        query = "SELECT * FROM users WHERE id = %(id)s;"
        results = connectToMySQL('MultiLingo').query_db(query, data)
        return cls(results[0])
    
    @classmethod
    def get_by_email(cls, data):
        query = "SELECT * FROM users WHERE email = %(email)s;"
        results = connectToMySQL('MultiLingo').query_db(query, data)
        print(f'get_by_email results: {results}')
        if len(results) < 1:
            return False
        return cls(results[0])

    
    @classmethod
    def save(cls, data):
        query = "INSERT INTO users (first_name, last_name, user_language, email, password, created_at, updated_at) VALUES (%(first_name)s, %(last_name)s, %(user_language)s,  %(email)s, %(password)s, NOW(), NOW());"  
        return connectToMySQL('MultiLingo').query_db(query, data)
    
    @classmethod
    def update(cls, data):
        query = "UPDATE users SET first_name = %(first_name)s, last_name = %(last_name)s, user_language = %(user_language)s, email = %(email)s, updated_at = NOW() WHERE id = %(id)s;"
        return connectToMySQL('MultiLingo').query_db(query, data)
    
    @classmethod
    def delete(cls, data):
        query = "DELETE FROM users WHERE id = %(id)s;"
        return connectToMySQL('MultiLingo').query_db(query, data)
    


