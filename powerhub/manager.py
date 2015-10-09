import tornado.web, tornado.ioloop
import tornado
import motor
import json
from tornado import gen
from bson.objectid import ObjectId
from tornado.options import options
from instagram import client
import config

api = client.InstagramAPI(access_token=config.access_token, client_secret=config.client_secret)


class StoriesHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @gen.engine
    def get(self):
        cursor = db.stories.find()
        groups = []
        while (yield cursor.fetch_next):
            obj = cursor.next_object()
            groups.append({"id": str(obj["_id"]), "fullname": obj["fullname"], "title": obj["title"]})
        self.write({"data": groups})
        self.set_header("Content-Type", "application/json")
        self.finish()

    def post(self):
        story_data = json.loads(self.request.body)
        story_id = db.stories.insert(story_data)
        print("story created with id " + str(story_id))
        self.set_header("Content-Type", "application/json")
        self.set_status(201)


class StoryHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @gen.engine
    def get(self, story_id):
        cursor = db.stories.find_one({"_id": ObjectId(str(story_id))})
        if cursor:
            self.write({"userId": story_id, "status": "SUCCESS", "data": cursor["title"]})
        else:
            self.write({"userId": story_id, "status": "FAILURE", "data": "Not Found"})
        self.set_header("Content-Type", "application/json")
        self.finish()


class RaceReviewHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @gen.engine
    def get(self, race_name):
        images = []
        response = api.tag_recent_media(tag_name=str(race_name))
        for media in response[0]:
            images.append(media.get_standard_resolution_url())

        cursor = yield db.raceinfo.find_one({"name": race_name})
        if cursor:
            race_info = {"name": str(cursor["name"]), "location": str(cursor["location"]), "date": str(cursor["date"]),
                         "time": str(cursor["time"]), "price": str(cursor["price"]), "link": str(cursor["link"])}
            people_review = db.reviews.find({"race": race_name})
            reviews = []
            while (yield people_review.fetch_next):
                obj = people_review.next_object()
                reviews.append(
                    {"id": str(obj["_id"]),
                     "rating": {"cost": str(obj["rating"]["cost"]),
                                "course": str(obj["rating"]["course"]),
                                "fluid": str(obj["rating"]["fluid"]),
                                "fuel": str(obj["rating"]["fuel"]),
                                "crowd": str(obj["rating"]["crowd"])
                     },
                     "pros": str(obj["pros"]),
                     "cons": str(obj["cons"]),
                     "story": str(obj["story"]),
                     "upvote": int(obj["upvote"])})
            self.write(
                {"race_name": str(race_name), "status": "SUCCESS",
                 "data": {"photos": images, "race_info": race_info, "reviews": reviews}})

        else:
            self.write({"race_name": race_name, "status": "FAILURE", "data": "Not Found"})
        self.set_header("Content-Type", "application/json")
        self.finish()


if __name__ == "__main__":
    handlers = [(r"/api/v1/stories", StoriesHandler),
                (r"/api/v1/stories/(.*)", StoryHandler),
                (r"/api/race/(.*)", RaceReviewHandler),
                (r"/(.*)", tornado.web.StaticFileHandler, {"path": "static", "default_filename": "index.html"}
                )]

    db = motor.MotorClient().getbookmarks
    application = tornado.web.Application(
        handlers,
        debug=options.debug,
        db=db
    )
    application.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
