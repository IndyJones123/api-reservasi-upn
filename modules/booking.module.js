const Joi = require("joi");
const prisma = require("../helpers/database");
const fs = require("fs");
const initIo = require("../app");

const testing = async () => {
    try {
        const io = await initIo();
        if (io) {
            console.log("ada pemesanan baru");
            io.emit("newBooking", "new booking");
        } else {
            console.error("Socket.io is not initialized yet.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

testing();

class _booking {
    addBooking = async (body, files) => {
        try {
            const schema = Joi.object({
                id_fasilitas: Joi.number().required(),
                id_harga: Joi.number(),
                id_account: Joi.number().required(),
                tanggal_pemesanan: Joi.date(),
                jam_checkin: Joi.string().required(),
                jam_checkout: Joi.string().required(),
                durasi: Joi.number(),
                total_harga: Joi.number(),
                status: Joi.string().required(),
                keterangan: Joi.string().required(),
            }).options({ abortEarly: false });

            const validation = schema.validate(body);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return { status: false, error: errorDetails.join(", ") };
            }

            const Booking = await prisma.pemesanan.create({
                data: {
                    id_harga: body.id_harga,
                    id_account: body.id_account,
                    tanggal_pemesanan: new Date(body.tanggal_pemesanan),
                    jam_checkin: body.jam_checkin,
                    jam_checkout: body.jam_checkout,
                    durasi: body.durasi,
                    total_harga: body.total_harga,
                    keterangan: body.keterangan,
                    status: body.status,
                    id_fasilitas: body.id_fasilitas,
                },
            });

            if (Booking) {
                return {
                    status: true,
                    code: 201,
                    message: "create pemesanan success",
                    data: Booking,
                };
            }
        } catch (error) {
            console.error("create pemesanan module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    getBooking = async () => {
        try {
            const Booking = await prisma.pemesanan.findMany({
                include: {
                    Account: {
                        include: {
                            Mahasiswa: {
                                select: {
                                    nama: true,
                                },
                            },
                            Dosen: {
                                select: {
                                    nama: true,
                                },
                            },
                            Umum: {
                                select: {
                                    nama: true,
                                },
                            },
                        },
                    },
                    Fasilitas: {
                        select: {
                            nama: true,
                        },
                    },
                },
            });

            if (Booking) {
                return {
                    status: true,
                    code: 200,
                    message: "Get Fasilitas success",
                    data: Booking,
                };
            }
        } catch (error) {
            console.error("get fasilitas module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    getBookingById = async (id) => {
        try {
            const Booking = await prisma.pemesanan.findUnique({
                where: {
                    id_pemesanan: Number(id),
                },
                include: {
                    Account: {
                        include: {
                            Mahasiswa: {
                                select: {
                                    nama: true,
                                },
                            },
                            Dosen: {
                                select: {
                                    nama: true,
                                },
                            },
                            Umum: {
                                select: {
                                    nama: true,
                                },
                            },
                        },
                    },
                    Harga: {
                        select: {
                            harga: true,
                        },
                    },
                    Fasilitas: {
                        select: {
                            nama: true,
                        },
                    },
                },
            });

            if (Booking) {
                return {
                    status: true,
                    code: 200,
                    message: "Get Pemesanan success",
                    data: Booking,
                };
            }
        } catch (error) {
            console.error("get fasilitas module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    getBookingByIdFasilitas = async (id) => {
        try {
            const Booking = await prisma.pemesanan.findMany({
                where: {
                    id_fasilitas: Number(id),
                },
            });

            if (Booking) {
                return {
                    status: true,
                    code: 200,
                    message: "Get Pemesanan success",
                    data: Booking,
                };
            }
        } catch (error) {
            console.error("get fasilitas module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    updateBooking = async (body, files) => {};

    deleteBooking = async (id) => {
        try {
            const Booking = await prisma.pemesanan.delete({
                where: {
                    id_pemesanan: Number(id),
                },
            });

            if (Booking) {
                return {
                    status: true,
                    code: 200,
                    message: "Delete Fasilitas success",
                };
            }
        } catch (error) {
            console.error("delete fasilitas module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    uploadBukti = async (id, file) => {
        try {
            const Booking = await prisma.pemesanan.update({
                where: {
                    id_pemesanan: Number(id),
                },
                data: {
                    bukti_pembayaran: file.filename,
                    status: "Menunggu Konfirmasi",
                },
            });

            if (Booking) {
                return {
                    status: true,
                    code: 200,
                    message: "Upload Bukti Pembayaran success",
                };
            }
        } catch (error) {
            console.error("upload bukti pembayaran module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    uploadSIK = async (id, file) => {
        try {
            const Booking = await prisma.pemesanan.update({
                where: {
                    id_pemesanan: Number(id),
                },
                data: {
                    SIK: file.filename,
                    status: "Menunggu Konfirmasi",
                },
            });

            if (Booking) {
                return {
                    status: true,
                    code: 200,
                    message: "Upload SIK success",
                };
            }
        } catch (error) {
            console.error("upload SIK module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    getBookingByIdUser = async (id) => {
        try {
            const Booking = await prisma.pemesanan.findMany({
                where: {
                    id_account: Number(id),
                },
                include: {
                    Fasilitas: {
                        select: {
                            nama: true,
                        },
                    },
                },
            });

            if (Booking) {
                return {
                    status: true,
                    code: 200,
                    message: "Get Pemesanan success",
                    data: Booking,
                };
            }
        } catch (error) {
            console.error("get fasilitas module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    updateStatus = async (id, body) => {
        try {
            const Booking = await prisma.pemesanan.update({
                where: {
                    id_pemesanan: Number(id),
                },
                data: {
                    status: body.status,
                },
            });

            if (Booking) {
                return {
                    status: true,
                    code: 200,
                    message: "Update Status success",
                };
            }
        } catch (error) {
            console.error("update status module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    addMahasiswaToKamar = async (id, body) => {
        try {
            const kamar = await prisma.kamar_asrama.findMany();

            const mahasiswa = await prisma.mahasiswa.findFirst({
                where: {
                    id_account: Number(body.idAccount),
                },
            });

            for (const item of kamar) {
                if (item.npm_bed1_a === mahasiswa.npm) {
                    return {
                        status: false,
                        message: "Mahasiswa Sudah Ada",
                    };
                } else if (item.npm_bed2_b === mahasiswa.npm) {
                    return {
                        status: false,
                        message: "Mahasiswa Sudah Ada",
                    };
                } else if (item.npm_bed3_c === mahasiswa.npm) {
                    return {
                        status: false,
                        message: "Mahasiswa Sudah Ada",
                    };
                }
            }

            for (const item of kamar) {
                if (item.npm_bed1_a === null) {
                    const addMahasiswa = await prisma.kamar_asrama.update({
                        where: {
                            id_asrama: item.id_asrama,
                        },
                        data: {
                            npm_bed1_a: mahasiswa.npm,
                        },
                    });

                    break;
                } else if (item.npm_bed2_b === null) {
                    const addMahasiswa = await prisma.kamar_asrama.update({
                        where: {
                            id_asrama: item.id_asrama,
                        },
                        data: {
                            npm_bed2_b: mahasiswa.npm,
                        },
                    });

                    break;
                } else if (item.npm_bed3_c === null) {
                    const addMahasiswa = await prisma.kamar_asrama.update({
                        where: {
                            id_asrama: item.id_asrama,
                        },
                        data: {
                            npm_bed3_c: mahasiswa.npm,
                        },
                    });

                    const updateStatusKamar = await prisma.kamar_asrama.update({
                        where: {
                            id_asrama: item.id_asrama,
                        },
                        data: {
                            status_kamar: false,
                        },
                    });

                    break;
                }
            }

            return {
                status: true,
                code: 200,
                message: "add mahasiswa to kamar success",
            };
        } catch (error) {
            console.error("add mahasiswa to kamar module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _booking();
