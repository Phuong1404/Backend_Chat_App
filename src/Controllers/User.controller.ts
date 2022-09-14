import { NextFunction, Request, Response } from "express";
import User from '../Models/User.model'
import * as bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import logging from "../Config/logging";
import Config from "../Config/config";
import signJWT from "../Functions/signJWT"
import * as jwt from 'jsonwebtoken';
import moment = require("moment");
const NAMESPACE = 'User';

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  logging.info(NAMESPACE, 'Token validated, user authorized.');

  return res.status(200).json({
    message: 'Token(s) validated'
  });
};

const register = async (req: Request, res: Response, next: NextFunction) => {
  let { name, email, phone, birthday, gender, password } = req.body;

  //Kiểm tra số điện thoại và email tồn tại

  let PhoneExist = await User.exists({ phone })
    .exec()
    .then((phones) => {
      return phones
    })

  let EmailExist = await User.exists({ email })
    .exec()
    .then((emails) => {
      return emails
    })
  if (PhoneExist != null) {
    return res.status(500).json({
      message: "Phone number already exists"
    });
  }
  else if (EmailExist != null) {
    return res.status(500).json({
      message: "Email address already exists"
    });
  }
  else {
    bcrypt.hash(password, 10, (hashError, hash) => {
      if (hashError) {
        return res.status(401).json({
          message: hashError.message,
          error: hashError
        });
      }
      const _user = new User({
        _id: new mongoose.Types.ObjectId(),
        name: name,
        email: email,
        phone: phone,
        birthday: birthday,
        gender: gender,
        password: hash,
        time_create:moment()
      });
      return _user
        .save()
        .then((user) => {
          return res.status(201).json({
            user
          });
        })
        .catch((error) => {
          return res.status(500).json({
            message: error.message,
            error
          });
        });
    });
  }
};

const login = (req: Request, res: Response, next: NextFunction) => {
  let { username, password } = req.body;

  User.find({ $or: [{ email: username }, { phone: username }] })
    .exec()
    .then((users) => {
      if (users.length !== 1) {
        return res.status(401).json({
          message: 'Unauthorized'
        });
      }

      bcrypt.compare(password, users[0].password, (error, result) => {
        if (error) {
          return res.status(401).json({
            message: 'Password Mismatch'
          });
        } else if (result) {
          signJWT(users[0], (_error, token) => {
            if (_error) {
              return res.status(500).json({
                message: _error.message,
                error: _error
              });
            } else if (token) {
              return res.status(200).json({
                message: 'Auth successful',
                token: token,
                user: users[0]
              });
            }
          });
        }
        else {
          return res.status(401).json({
            message: 'Password Mismatch'
          });
        }
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

const getUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = String(req.headers['authorization'] || '')

  const token = authHeader.substring(7, authHeader.length);
  const payload = jwt.verify(token, Config.server.token.secret)

  User.findOne({ email: payload.email })
    .select('-password -contact -channel')
    .exec()
    .then((users) => {
      return res.status(200).json({
        data: users,
        count: 1
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error
      });
    });
};

const getContactUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = String(req.headers['authorization'] || '')

  const token = authHeader.substring(7, authHeader.length);
  const payload = jwt.verify(token, Config.server.token.secret)

  User.findOne({ email: payload.email })
    .select('contact')
    .exec()
    .then((users) => {
      return res.status(200).json({
        data: users.contact,
        count: 1
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error
      });
    });
}

const getChannelUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = String(req.headers['authorization'] || '')

  const token = authHeader.substring(7, authHeader.length);
  const payload = jwt.verify(token, Config.server.token.secret)

  User.findOne({ email: payload.email })
    .select('channel')
    .exec()
    .then((users) => {
      return res.status(200).json({
        data: users.channel,
        count: 1
      });
    })
    .catch((error) => {
      return res.status(500).json({
        message: error.message,
        error
      });
    });
}

const changePassword = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = String(req.headers['authorization'] || '')
  const token = authHeader.substring(7, authHeader.length);
  const payload = jwt.verify(token, Config.server.token.secret)

  let { oldpassword, password, repassword } = req.body;
  if (password == repassword) {
    User.findOne({ email: payload.email })
      .select('password')
      .exec()
      .then((users) => {
        if (!users) {
          return res.status(401).json({
            message: 'Account does not exist'
          });
        }
        bcrypt.compare(oldpassword, users.password, (error, result) => {
          if (error) {
            return res.status(401).json({
              message: 'Password Mismatch'
            });
          } else if (result) {
            bcrypt.hash(password, 10, (hashError, hash) => {
              if (hashError) {
                return res.status(401).json({
                  message: hashError.message,
                  error: hashError
                });
              }
              User.findOneAndUpdate({ email: payload.email }, { password: hash,time_update:moment() })
                .then((users) => {
                  return res.status(201).json({
                    message:"Done"
                  });
                })
            });
          }
          else {
            return res.status(401).json({
              message: 'Password Mismatch'
            });
          }
        });
      })
      .catch((error) => {
        return res.status(500).json({
          message: error.message,
          error
        });
      });
  }
  else {
    return res.status(500).json({
      message: "re-password is incorrect"
    });
  }
}

const changeInfomation = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = String(req.headers['authorization'] || '')
  const token = authHeader.substring(7, authHeader.length);
  const payload = jwt.verify(token, Config.server.token.secret)

  let { name, birthday, gender } = req.body;

  User.findOneAndUpdate({ email: payload.email }, { name: name, birthday: birthday, gender: gender,time_update:moment() })
    .then((users) => {
      return res.status(201).json({
        message:"Done"
      });
    })
}

export default { validateToken, register, login, getUser, getContactUser, getChannelUser, changePassword, changeInfomation }
