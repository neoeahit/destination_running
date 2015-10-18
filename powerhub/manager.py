import tornado.web, tornado.ioloop
import tornado
import motor
import auth
from tornado import gen
from bson.objectid import ObjectId
from tornado.options import options
from instagram import client
import config
import json

api = client.InstagramAPI(access_token=config.access_token, client_secret=config.client_secret)


class UpdateUpvotes(auth.BaseHandler):
    @tornado.web.asynchronous
    @gen.engine
    @tornado.web.authenticated
    def post(self):
        request_params = json.loads(self.request.body)
        reviewId = request_params['id']
        cursor = yield db.reviews.update({"_id": ObjectId(str(reviewId))}, {
            '$inc': {
                'upvote': 1
            }
        })
        if cursor["updatedExisting"]:
            self.write({"status": "SUCCESS"})
        else:
            self.write({"status": "FAILURE"})
        self.finish()


class AddReview(auth.BaseHandler):
    @tornado.web.asynchronous
    @gen.engine
    @tornado.web.authenticated
    def post(self):
        request_params = json.loads(self.request.body)
        race_name = request_params['race']
        pros = request_params['pros']
        cons = request_params['cons']
        story = request_params['story']
        rating = request_params['rating']
        cursor = yield db.reviews.insert(
            {"username": self.get_current_user().replace('"',''),
             "upvote": 0,
             "race": race_name,
             "rating": rating,
             "pros": pros,
             "cons": cons,
             "story": story})
        if cursor:
            self.write({"status": "SUCCESS"})
        else:
            self.write({"status": "FAILURE"})
        self.finish()


class RaceReviewHandler(auth.BaseHandler):
    @tornado.web.asynchronous
    @gen.engine
    @tornado.web.authenticated
    def post(self):
        request_params = json.loads(self.request.body)
        race_name = request_params['race']
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
                     "rating": {"cost": str(obj["rating"]["Cost"]),
                                "course": str(obj["rating"]["Course"]),
                                "fluid": str(obj["rating"]["Fluid"]),
                                "fuel": str(obj["rating"]["Fuel"]),
                                "crowd": str(obj["rating"]["Crowd"])
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
    handlers = [
        (r"/api/race", RaceReviewHandler),
        (r"/api/update/upvotes", UpdateUpvotes),
        (r"/api/add/review", AddReview),
        (r"/auth/login/", auth.AuthLoginHandler),
        (r"/auth/logout/", auth.AuthLogoutHandler),
        (r"/(.*)", tornado.web.StaticFileHandler, {"path": "static", "default_filename": "index.html"}
        )]

    db = motor.MotorClient().getbookmarks
    application = tornado.web.Application(
        handlers,
        debug=options.debug,
        db=db,
        cookie_secret="61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo=",
        login_url="/auth/login/"
    )
    application.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
