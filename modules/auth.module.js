const Joi = require("joi");
const prisma = require("../helpers/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("fs");

class _auth {
    loginMahasiswa = async (body) => {
        try {
            const schema = Joi.object({
                npm_mahasiswa: Joi.string().required(),
                password_mahasiswa: Joi.string().required(),
            }).options({ abortEarly: false });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return { status: false, error: errorDetails.join(", ") };
            }

            const checkNpm = await prisma.mahasiswa.findUnique({
                where: {
                    npm_mahasiswa: body.npm_mahasiswa,
                },
            });

            if (!checkNpm) {
                return {
                    status: false,
                    error: "NPM not registered",
                };
            }

            const checkPassword = bcrypt.compareSync(
                body.password_mahasiswa,
                checkNpm.password_mahasiswa
            );

            if (!checkPassword) {
                return {
                    status: false,
                    error: "Wrong password",
                };
            }

            const payload = {
                id_mahasiswa: checkNpm.id_mahasiswa,
                npm_mahasiswa: checkNpm.npm_mahasiswa,
                nama_mahasiswa: checkNpm.nama_mahasiswa,
                fakultas_mahasiswa: checkNpm.fakultas_mahasiswa,
                jurusan_mahasiswa: checkNpm.jurusan_mahasiswa,
                tahun_ajaran_mahasiswa: checkNpm.tahun_ajaran_mahasiswa,
                no_telp_mahasiswa: checkNpm.no_telp_mahasiswa,
            };

            const token = jwt.sign(payload, "jwt-secret-code", {
                expiresIn: "1d",
            });

            return {
                status: true,
                data: {
                    message: "Login success, here's your token",
                    token: token,
                },
            };
        } catch (error) {
            console.error("login auth module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    loginUmum = async (body) => {
        try {
            const schema = Joi.object({
                email: Joi.string().email().required(),
                password: Joi.string().required(),
            }).options({ abortEarly: false });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return { status: false, error: errorDetails.join(", ") };
            }

            const checkEmail = await prisma.account.findUnique({
                where: {
                    email: body.email,
                },
            });

            if (!checkEmail) {
                return {
                    status: false,
                    error: "Email not registered",
                };
            }

            const checkPassword = bcrypt.compareSync(
                body.password,
                checkEmail.password
            );

            if (!checkPassword) {
                return {
                    status: false,
                    error: "Wrong password",
                };
            }

            const payload = {
                id_account: checkEmail.id_account,
                email: checkEmail.email,
                nama: checkEmail.nama,
                no_telp: checkEmail.no_telp,
                role: checkEmail.role,
            };

            const token = jwt.sign(payload, "jwt-secret-code", {
                expiresIn: "1d",
            });

            return {
                status: true,
                data: {
                    message: "Login success, here's your token",
                    token: token,
                },
            };
        } catch (error) {
            console.error("login auth module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    registerMahasiswa = async (body, file) => {
        try {
            //check type and not null of the variable
            const schema = Joi.object({
                nama_mahasiswa: Joi.string().required(),
                npm_mahasiswa: Joi.string().required(),
                password_mahasiswa: Joi.string().required(),
                tahun_ajaran_mahasiswa: Joi.string().required(),
                fakultas_mahasiswa: Joi.string().required(),
                jurusan_mahasiswa: Joi.string().required(),
                no_telp_mahasiswa: Joi.string().required(),
                status_mahasiswa: Joi.boolean().required(),
            }).options({ abortEarly: false });

            const validation = schema.validate(body);

            if (validation.error) {
                fs.unlinkSync(`./public/${file.filename}`);
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return { status: false, error: errorDetails.join(", ") };
            }

            const bukti_regis_mahasiswa = file ? file.filename : null;

            //check if npm already registered or not
            const checkNpm = await prisma.mahasiswa.findUnique({
                where: {
                    npm_mahasiswa: body.npm_mahasiswa,
                },
            });

            if (checkNpm) {
                fs.unlinkSync(`./public/${file.filename}`);
                return {
                    status: false,
                    error: "NPM already registered",
                };
            }

            //hash password
            const hash_password = bcrypt.hashSync(body.password_mahasiswa, 10);

            //insert data to database
            const insertData = await prisma.mahasiswa.create({
                data: {
                    nama_mahasiswa: body.nama_mahasiswa,
                    npm_mahasiswa: body.npm_mahasiswa,
                    password_mahasiswa: hash_password,
                    tahun_ajaran_mahasiswa: parseInt(
                        body.tahun_ajaran_mahasiswa
                    ),
                    fakultas_mahasiswa: body.fakultas_mahasiswa,
                    jurusan_mahasiswa: body.jurusan_mahasiswa,
                    no_telp_mahasiswa: body.no_telp_mahasiswa,
                    status_mahasiswa: body.status_mahasiswa,
                    bukti_regis_mahasiswa: bukti_regis_mahasiswa,
                },
            });

            if (insertData) {
                return {
                    status: true,
                    code: 201,
                    message: "Register success",
                };
            }
        } catch (error) {
            if (file) {
                fs.unlinkSync(`./public/${file.filename}`);
            }
            console.error("register auth module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    registerAccount = async (body, file) => {
        try {
            //check type and not null of the variable
            const schema = Joi.object({
                NIK: Joi.string(),
                NIP: Joi.string(),
                nama: Joi.string().required(),
                email: Joi.string().email().required(),
                password: Joi.string().required(),
                no_telp: Joi.string().required(),
                role: Joi.boolean().required(),
                status_account: Joi.string().required(),
            }).options({ abortEarly: false });

            const validation = schema.validate(body);

            if (validation.error) {
                fs.unlinkSync(`./public/${file.filename}`);
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return { status: false, error: errorDetails.join(", ") };
            }

            const bukti_regis = file ? file.filename : null;

            //check if email already registered or not
            const checkEmail = await prisma.account.findUnique({
                where: {
                    email: body.email,
                },
            });

            if (checkEmail) {
                fs.unlinkSync(`./public/${file.filename}`);
                return {
                    status: false,
                    error: "Email already registered",
                };
            }

            //hash password
            const hash_password = bcrypt.hashSync(body.password, 10);

            //insert data to database

            const insertData = await prisma.account.create({
                data: {
                    NIK: body.NIK,
                    NIP: body.NIP,
                    nama: body.nama,
                    email: body.email,
                    password: hash_password,
                    no_telp: body.no_telp,
                    role: body.role,
                    status_account: body.status_account,
                    bukti_regis: bukti_regis,
                },
            });

            if (insertData) {
                return {
                    status: true,
                    code: 201,
                    message: "Register success",
                };
            }
        } catch (error) {
            if (file) {
                fs.unlinkSync(`./public/${file.filename}`);
            }
            console.error("register auth module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    loginAdmin = async (body) => {
        try {
            const schema = Joi.object({
                username_admin: Joi.string().required(),
                password_admin: Joi.string().required(),
            }).options({ abortEarly: false });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return { status: false, error: errorDetails.join(", ") };
            }

            const checkUsername = await prisma.admin.findFirst({
                where: {
                    username_admin: body.username_admin,
                },
            });

            if (!checkUsername) {
                return {
                    status: false,
                    error: "Username not registered",
                };
            }

            const checkPassword = bcrypt.compareSync(
                body.password_admin,
                checkUsername.password_admin
            );

            if (!checkPassword) {
                return {
                    status: false,
                    error: "Wrong password",
                };
            }

            const payload = {
                id_admin: checkUsername.id_admin,
                username_admin: checkUsername.username_admin,
            };

            const token = jwt.sign(payload, "jwt-secret-code", {
                expiresIn: "1d",
            });

            return {
                status: true,
                data: {
                    message: "Login success, here's your token",
                    token: token,
                },
            };
        } catch (error) {
            console.error("login auth module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _auth();
