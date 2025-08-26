import UserRepositories from '../repositories/index.js';
import response from '../../../utils/response.js';
import InvariantError from '../../../exceptions/invariant-error.js';
import NotFoundError from '../../../exceptions/not-found-error.js';

export const createUser = async (req, res, next) => {
  const { username, password, fullname } = req.validated;
  const isUsernameExist = await UserRepositories.verifyNewUsername(username);

  if (isUsernameExist) {
    return next(new InvariantError('Username sudah digunakan'));
  }

  const user = await UserRepositories.createUser({
    username,
    password,
    fullname
  });

  return response(res, 201, 'User berhasil ditambahkan', user);
};

export const getUsers = async (req, res) => {
  const users = await UserRepositories.getUsers();
  return response(res, 200, 'Users berhasil ditampilkan', { users });
};

export const getUserById = async (req, res, next) => {
  const { id } = req.params;
  const user = await UserRepositories.getUserById(id);

  if (!user) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  return response(res, 200, 'User berhasil ditampilkan', { user });
};

export const editUser = async (req, res, next) => {
  const { id } = req.params;
  const { username, password, fullname } = req.validated;

  const user = await UserRepositories.editUser({
    id,
    username,
    password,
    fullname
  });

  if (!user) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  return response(res, 200, 'User berhasil diperbarui', user);
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  const deletedUser = await UserRepositories.deleteUser(id);

  if (!deletedUser) {
    return next(new NotFoundError('User tidak ditemukan'));
  }

  return response(res, 200, 'User berhasil dihapus', deletedUser);
};