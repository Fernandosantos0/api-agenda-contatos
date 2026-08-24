class HomeController {
	async index(req, res) {
        return res.status(200).json({
            msg: "Seja bem-vindo!😁"
        });
    }
}


export default new HomeController();
