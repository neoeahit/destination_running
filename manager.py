import tornado.web, tornado.ioloop
import tornado
import motor
from tornado.options import define, options

define("port", default=9003)
define("debug", default=True)


if __name__ == "__main__":
    handlers = [
        (r"/(.*)", tornado.web.StaticFileHandler, {"path": "static", "default_filename": "index.html"}),
    ]

    db = motor.MotorClient().planit
    application = tornado.web.Application(
        handlers,
        debug=options.debug,
        db=db
    )
    application.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
