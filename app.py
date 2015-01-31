from flask import Flask, render_template, request
from bson.json_util import dumps
from pymongo import MongoClient
import json
import time

app = Flask(__name__)

client = MongoClient()
db = client.coastergame
users = db.users
saves = db.saves


@app.route('/')
@app.route('/index')
def index():
	return render_template('index.html')
	

@app.route('/oldgame')
def oldcode():
	return render_template('old.html')

                    
@app.route('/loadMap', methods=['POST'])
def loadMap():
	if request.method == 'POST':
		username = request.form['username']
		map = saves.find_one({'username': username})
		if map != None:
			result = json.dumps({'map_exists': True, 'data': dumps(map)})
		else:
			result = json.dumps({'map_exists': False})
	else:
		result = json.dumps({'map_exists': False})
	return result


@app.route('/saveMap', methods=['POST'])
def saveMap():
	if request.method == 'POST':
		username = request.form['username']
		map = request.form['map']
		tm = int(time.time())
		if saves.find_one({'username': username}) != None:
			# simply upate existing board
			saves.update({'username': username}, {'$set': {'map': map, 'saveTime': tm}})
			result = {'saved': True, 'method': 'update'}
		else:
			saves.insert({'username': username, 'map': map, 'saveTime': tm})
			result = {'saved': True, 'method': 'insert'}
	else:
		result = {'saved': False}
	return json.dumps(result)


client.close()

if __name__ == "__main__":
	app.run(debug=True)