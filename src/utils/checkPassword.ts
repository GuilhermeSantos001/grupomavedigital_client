/**
 * @description Função usada para verificar se a variavel passa por todos
 * os criterios exigidos para aumentar a segurança
 * @author @GuilhermeSantos001
 * @update 01/10/2021
 */

const checkPassword = (password: string): string | boolean => {
  let strength = 0;

  if (password.match(/[a-z]+/)) {
    strength += 1;
  }

  if (password.match(/[A-Z]+/)) {
    strength += 1;
  }

  if (password.match(/[0-9]+/)) {
    strength += 1;
  }

  if (password.match(/[$@#!]+/)) {
    strength += 1;
  }

  if (password.length < 6) {
    return "A senha deve conter no mínimo 6 caracteres.";
  }

  if (password.length > 256) {
    return "A senha deve conter no máximo 256 caracteres.";
  }

  if (strength < 4) {
    return "A senha deve conter no mínimo uma letra minúscula e maiúscula, um número e um caractere especial: $@#!";
  }

  if (password.match(/[=\-()&¨"'`{}?/\-+.,;|%*]+/)) {
    return `A senha não deve conter nenhum desses caracteres especiais: =-()&¨"'\`{}?/-+.,;\\|%*`;
  }

  return true;
};

export default checkPassword;