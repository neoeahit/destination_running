from tornado.httpclient import AsyncHTTPClient
import tornado.web, tornado.ioloop
import tornado
from tornado import gen
import json
from tornado.options import parse_command_line, define, options
import json
import time

define("port", default=9002)
define("debug", default=True)



class GetPOI(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    @gen.engine
    def get(self, lat,long):
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=26.85,80.91&radius=5000&types=amusement_park|aquarium|art_gallery|casino|church|movie_theater|museum|night_club|park|place_of_worship|shopping_mall|stadium|zoo&key=AIzaSyA8MmFkF5Ji43km2k5iihT_yl7MBZ0eiKM'
        http_client = AsyncHTTPClient()
        response = yield http_client.fetch(url)
        self.finish(response.body)

if __name__ == "__main__":
    handlers = [
        (r"/api/lat/([%&+ \w]+)/long/([%&+ \w]+)", GetPOI),
        (r"/(.*)", tornado.web.StaticFileHandler, {"path": "static", "default_filename": "index.html"}),
    ]

    application = tornado.web.Application(
        handlers,
        debug=options.debug,
    )
    application.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
