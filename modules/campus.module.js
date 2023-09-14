const prisma = require("../helpers/database");

class _campus {
    getFakultas = async () => {
        try {
            const Fakultas = await prisma.fakultas.findMany({
                select: {
                    id_fakultas: true,
                    nama_fakultas: true,
                },
            });

            if (Fakultas) {
                return {
                    status: true,
                    code: 200,
                    message: "Get Fakultas success",
                    data: Fakultas,
                };
            }
        } catch (error) {
            console.error("get fakultas module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };

    getProdi = async () => {
        try {
            const Prodi = await prisma.prodi.findMany({
                select: {
                    id_prodi: true,
                    nama_prodi: true,
                },
            });

            if (Prodi) {
                return {
                    status: true,
                    code: 200,
                    message: "Get Prodi success",
                    data: Prodi,
                };
            }
        } catch (error) {
            console.error("get prodi module Error: ", error);
            return {
                status: false,
                error,
            };
        }
    };
}

module.exports = new _campus();
