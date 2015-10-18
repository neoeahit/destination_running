import tornado.web, tornado.ioloop
import json


class BaseHandler(tornado.web.RequestHandler):
    def get_current_user(self):
        return self.get_secure_cookie("user")


class AuthLoginHandler(BaseHandler):
    def check_permission(self, password, username):
        if username == "admin" and password == "admin":
            return True
        if username == "vipul" and password == "vipul":
            return True
        else:
            return False

    def post(self):
        request_params = json.loads(self.request.body)
        username = request_params["username"]
        password = request_params["password"]
        auth = self.check_permission(password, username)
        if auth:
            self.set_current_user(username)
            self.finish({'status': 'SUCCESS'})
        else:
            error_msg = u"?error=" + tornado.escape.url_escape("Login incorrect")
            self.finish({'status': 'FAILURE'})

    def set_current_user(self, user):
        if user:
            self.set_secure_cookie("user", tornado.escape.json_encode(user))
        else:
            self.clear_cookie("user")


class AuthLogoutHandler(BaseHandler):
    def get(self):
        self.clear_cookie("user")
        self.redirect(self.get_argument("next", "/"))