const prisma = require("../helpers/database");

class _users {
    getAccount = async () => {
        try {
            const account = await prisma.account.findMany({
                include: {
                    Role: true,
                    Mahasiswa: true,
                    Dosen: true,
                    Umum: true,
                },
            });

            if (account) {
                return {
                    status: true,
                    code: 200,
                    message: "Get Account success",
                    data: account,
                };
            }
        } catch (error) {
            console.error("get account module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    updateStatusAccount = async (id, body) => {
        try {
            const account = await prisma.account.update({
                where: {
                    id_account: parseInt(id),
                },
                data: {
                    status_account: body.status_account,
                },
            });

            if (account) {
                if (account.id_role == 1) {
                    const dosen = await prisma.dosen.update({
                        where: {
                            id: parseInt(body.id),
                        },
                        data: {
                            status: body.status_account,
                        },
                    });
                } else if (account.id_role == 2) {
                    const mahasiswa = await prisma.mahasiswa.update({
                        where: {
                            id: parseInt(body.id),
                        },
                        data: {
                            status: body.status_account,
                        },
                    });
                } else if (account.id_role == 3) {
                    const umum = await prisma.umum.update({
                        where: {
                            id: parseInt(body.id),
                        },
                        data: {
                            status: body.status_account,
                        },
                    });
                }

                return {
                    status: true,
                    code: 200,
                    message: "Update status_account success",
                };
            }
        } catch (error) {
            console.error("update account module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    getDosen = async () => {
        try {
            const dosen = await prisma.dosen.findMany({});

            if (dosen) {
                return {
                    status: true,
                    code: 200,
                    message: "Get Dosen success",
                    data: dosen,
                };
            }
        } catch (error) {
            console.error("get dosen module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    getMahasiswa = async () => {
        try {
            const mahasiswa = await prisma.mahasiswa.findMany({});

            if (mahasiswa) {
                return {
                    status: true,
                    code: 200,
                    message: "Get Mahasiswa success",
                    data: mahasiswa,
                };
            }
        } catch (error) {
            console.error("get mahasiswa module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    getUmum = async () => {
        try {
            const umum = await prisma.umum.findMany({});

            if (umum) {
                return {
                    status: true,
                    code: 200,
                    message: "Get umum success",
                    data: umum,
                };
            }
        } catch (error) {
            console.error("get umum module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    getAccountById = async (id) => {
        try {
            const account = await prisma.account.findUnique({
                where: {
                    id: parseInt(id),
                },
            });

            if (account) {
                return {
                    status: true,
                    code: 200,
                    message: "Get Account success",
                    data: account,
                };
            }
        } catch (error) {
            console.error("get account module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    updateStatus = async (id, body) => {
        try {
            const account = await prisma.account.update({
                where: {
                    id: parseInt(id),
                },
                data: {
                    status_account: body.status_account,
                },
            });

            if (account) {
                return {
                    status: true,
                    code: 200,
                    message: "Update status_account success",
                };
            }
        } catch (error) {
            console.error("update account module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    updateStatusMahasiswa = async (id, body) => {
        try {
            const mahasiswa = await prisma.mahasiswa.update({
                where: {
                    id_mahasiswa: parseInt(id),
                },
                data: {
                    status: body.status,
                },
            });

            if (mahasiswa) {
                return {
                    status: true,
                    code: 200,
                    message: "Update status_mahasiswa success",
                };
            }
        } catch (error) {
            console.error("update mahasiswa module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    deleteDosen = async (id) => {
        try {
            const account = await prisma.dosen.delete({
                where: {
                    id: parseInt(id),
                },
            });

            if (account) {
                return {
                    status: true,
                    code: 200,
                    message: "Delete Account success",
                };
            }
        } catch (error) {
            console.error("delete account module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    deleteUmum = async (id) => {
        try {
            const umum = await prisma.umum.delete({
                where: {
                    id: parseInt(id),
                },
            });

            if (account) {
                return {
                    status: true,
                    code: 200,
                    message: "Delete Account success",
                };
            }
        } catch (error) {
            console.error("delete account module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    deleteMahasiswa = async (id) => {
        try {
            const account = await prisma.mahasiswa.delete({
                where: {
                    id: parseInt(id),
                },
            });

            if (account) {
                return {
                    status: true,
                    code: 200,
                    message: "Delete Account success",
                };
            }
        } catch (error) {
            console.error("delete account module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _users();
