import { get } from 'lodash';
import { isEmail } from 'validator';
import { ObjectId } from 'mongodb';

import connection from '../db';

class ContatoController {
    // CREATE
	async store(req, res) {
		const body = get(req, 'body', false);

		if (!body) {
			return res.status(400).json({
				errors: 'Os dados do novo contato não foi enviado',
			});
		}

		// VALIDAÇÃO
		if (!body.nome) {
			return res.status(400).json({
				errors: 'O campo "nome" é de preenchimento obrigatório',
			});
		}

		if (body.nome) {
			if (body.nome.length < 3) {
				return res.status(400).json({
					errors: 'O nome deve ter no mínimo 3 caracteres',
				});
			}
		}

		if (body.email) {
			// Validando o email
			if (!isEmail(body.email)) {
				return res.status(400).json({
					errors: 'E-mail inválido',
				});
			}
		}

		if (body.telefone) {
			if (RegExp(/\D/).test(body.telefone)) {
				return res.status(400).json({
					errors: 'O telefone somente deve ter números',
				});
			}

			if (body.telefone.length > 11 || body.telefone.length < 8) {
				return res.status(400).json({
					errors: 'O telefone deve ter de 8 a 11 digitos',
				});
			}
		}

		if (body.celular) {
			if (RegExp(/\D/).test(body.celular)) {
				return res.status(400).json({
					errors: 'O celular somente deve ter números',
				});
			}

			if (body.celular.length > 11 || body.celular.length < 8) {
				return res.status(400).json({
					errors: 'O celular deve ter de 8 a 9 digitos',
				});
			}
		}

		if (!(body.email || body.telefone || body.celular)) {
			return res.status(400).json({
				errors: 'Pelo menos um dos contatos deve ser cadastrado (e-mail ou telefone ou celular)',
			});
		}
		// ******************************************************

		try {
			const db = await connection();

			// Verificando se contato já existe
            if (body.email){
                if (await db.findOne({ email: body.email })) {
                    return res.status(400).json({
                        errors: 'E-mail já foi cadastrado',
                    });
                }
            }

            if (body.telefone){
                if (await db.findOne({ telefone: body.telefone })) {
                    return res.status(400).json({
                        errors: 'Telefone já foi cadastrado',
                    });
                }
            }

            if (body.celular){
                if (await db.findOne({ celular: body.celular })) {
                    return res.status(400).json({
                        errors: 'Celular já foi cadastrado',
                    });
                }
            }

			const { insertedId: _id } = await db.insertOne(body);

			if (!_id) {
				return res.status(500).json({
					errors: 'Houve um erro inesperado',
				});
			}

			const contato = await db.findOne({ _id });

			return res.status(201).json(contato);
		} catch (e) {
			return res.status(400).json({
				errors: 'Houve um erro ao cadastrar contato',
				message: e.message,
			});
		}
	}

    // READ
	async index(req, res) {
		try {
			const db = await connection();

			const contatos = await db.find({}).toArray();
			return res.status(200).json(contatos);
		} catch (e) {
			return res.status(400).json({
				errors: 'Houve um erro ao buscar contatos',
				message: e.message,
			});
		}
	}

    // READ BY ID
	async show(req, res) {
		const id = get(req, 'params.id');

		try {
			const db = await connection();

			const contato = await db.findOne({ _id: new ObjectId(id) });

			if (!contato) {
				return res.status(200).json({
					errors: 'Contato não existe',
				});
			}

			return res.status(200).json(contato);
		} catch (e) {
			console.log(e);
			return res.status(400).json({
				errors: 'Não foi possível resgatar o contato',
				message: e.message,
			});
		}
	}

    // UPDATE
	async update(req, res) {

		const id = get(req, 'params.id');
        const body = get(req, 'body', false);

        if(!body) {
            return res.status(400).json({
                errors: "Os dados do contato não foi enviado"
            });
        }

        // VALIDAÇÃO
        if(!body.nome) {
            return res.status(400).json({
                errors: 'O campo "nome" é de preenchimento obrigatório '
            });
        }

        if(body.nome) {
            if(body.nome.length < 3) {
                return res.status(400).json({
                    errors: 'O nome deve ter no mínimo 3 caracteres'
                });
            }
        }

        if(body.email) { // Validando o email
            if(!isEmail(body.email)) {
                return res.status(400).json({
                    errors: 'E-mail inválido'
                });
            }
        }

        if(body.telefone) {

            if(RegExp(/\D/).test(body.telefone)) {
                return res.status(400).json({
                    errors: 'O telefone somente deve ter números'
                });
            }

            if(body.telefone.length > 11 || body.telefone.length < 8) {
                return res.status(400).json({
                    errors: 'O telefone deve ter de 8 a 11 digitos'
                });
            }

        }

        if(body.celular) {

            if(RegExp(/\D/).test(body.celular)) {
                return res.status(400).json({
                    errors: 'O celular somente deve ter números'
                });
            }

            if(body.celular.length > 11 || body.celular.length < 8) {
                return res.status(400).json({
                    errors: 'O celular deve ter de 8 a 9 digitos'
                });
            }

        }

        if(!(body.email || body.telefone || body.celular)) {
            return res.status(400).json({
                errors: 'Pelo menos um dos contatos deve ser cadastrado (e-mail ou telefone ou celular)'
            });
        }
        // ************************************************
        try {
            const db = await connection();

            if(!(await db.findOne({ _id: new ObjectId(id) }))) {
                return res.status(200).json({
                    errors: 'Contato não existe'
                });
            }

            // Edição
            await db.updateOne({ _id: new ObjectId(id) }, { $set: { ...body } });

            const contato = await db.findOne({ _id: new ObjectId(id) });

            return res.status(200).json(contato);
        } catch(e) {
            return res.status(400).json({
                errors: 'Não foi possível atualizar o contato',
                message: e.message
            });
        }
    }

    // DELETE
	async delete(req, res) {
		const id = get(req, 'params.id');

		try {
			const db = await connection();

			const contato = await db.findOne({ _id: new ObjectId(id) });

			if (!contato) {
				return res.status(200).json({
					errors: 'Contato não existe',
				});
			}

			await db.deleteOne({ _id: new ObjectId(id) });

			return res.status(200).json(contato);
		} catch (e) {
			console.log(e);
			return res.status(400).json({
				errors: 'Não foi possível apagar o contato',
				message: e.message,
			});
		}
	}
}

export default new ContatoController();
