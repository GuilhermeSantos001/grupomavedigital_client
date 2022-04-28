/**
 * @description Classe global da aplicação
 * @author GuilhermeSantos001
 * @update 04/08/2021
 * @version 1.0.0
 */

class App {
    static readonly version: string = '0.1.0';

    static readonly license: string = 'MIT';

    static readonly author: string = 'GuilhermeSantos001 <luizgp120@hotmail.com>';

    static readonly fullname: string = 'Rocket.js';

    static block_close_page(): void {
        window.onbeforeunload = function (e) {
            // Cancelar o evento
            e.preventDefault(); // Se você impedir o comportamento padrão no Mozilla Firefox, o prompt será sempre mostrado
            // O Chrome requer que returnValue seja definido
            e.returnValue = '';
        };
    }

    static external_mail_open(email: string) {
        return window.open(`mailto:${email}`, '_blank');
    }
}

export default App;