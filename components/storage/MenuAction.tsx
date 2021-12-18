/**
 * @description Componentes do menu de ações do GED
 * @author @GuilhermeSantos001
 * @update 08/12/2021
 */

import React from 'react'
import { Dropdown, OverlayTrigger, Button, Tooltip } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import HerculesContext from '@/context/hercules.context'

type MyProps = {
    type: Type
}

type MyStates = {
    options: {
        folder: IOptions
        file: IOptionsFile
    }
}

declare interface IOptions {
    share: boolean
    delete: boolean
    protect: boolean
    block: boolean
    moveToFolder: boolean
}

declare interface IOptionsFile extends IOptions {
    download: boolean
}

declare interface IOptionsAll extends IOptions, IOptionsFile { }

declare type Type = 'folder' | 'file'

export default class MenuAction extends React.Component<MyProps, MyStates> {
    static contextType = HerculesContext
    declare context: React.ContextType<typeof HerculesContext>

    constructor(props) {
        super(props)

        this.state = {
            options: {
                folder: {
                    share: false,
                    delete: false,
                    protect: false,
                    block: false,
                    moveToFolder: false
                },
                file: {
                    share: false,
                    delete: false,
                    protect: false,
                    block: false,
                    download: false,
                    moveToFolder: false
                }
            }
        }
    }

    getOptions(type: Type, except: (keyof IOptionsAll)[] = ['share', 'delete', 'protect']) {
        const keys: any = Object.keys(this.state.options[type]).filter((key: any) => !except.includes(key));

        return keys.map((key) => {
            const name = this.getOptionName(key);

            return <Dropdown.Item key={`actionOption-${name}`} className='d-flex flex-row justify-content-center align-items-center text-white'>
                <FontAwesomeIcon
                    icon={this.getOptionIcon(key)}
                    className={`menuAction-icon dropdown ${this.hasItemAction() ? 'enable' : 'disable'}`}
                /> {name}
            </Dropdown.Item>
        })
    }

    getOptionName(key: keyof IOptionsAll) {
        switch (key) {
            case 'share':
                return 'Compartilhar';
            case 'delete':
                return 'Excluir';
            case 'protect':
                return 'Proteger';
            case 'block':
                return 'Bloquear';
            case 'moveToFolder':
                return 'Mover para pasta';
            case 'download':
                return 'Baixar';
            default:
                return '???';
        }
    }

    getOptionIcon(key: keyof IOptionsAll) {
        switch (key) {
            case 'share':
                return Icon.render('fas', 'share');
            case 'delete':
                return Icon.render('fas', 'trash');
            case 'protect':
                return Icon.render('fas', 'lock');
            case 'block':
                return Icon.render('fas', 'shield-alt');
            case 'moveToFolder':
                return Icon.render('fas', 'folder-open');
            case 'download':
                return Icon.render('fas', 'download');
            default:
                return Icon.render('fas', 'ban');
        }
    }

    hasItemAction() {
        if (this.props.type === 'folder')
            return this.context.countFolderItemAction() > 0;
        else if (this.props.type)
            return this.context.countFileItemAction() > 0;
        else
            return false;
    }

    getTooltip(key: keyof IOptionsAll) {
        switch (key) {
            case 'share':
                return <Tooltip>
                    <strong>Você pode</strong> compartilhar {this.props.type === 'folder' ? 'várias pastas' : 'vários arquivos'} de uma vez, mas não
                    recomendamos fazer isso, pois você usará a mesma <strong>chave secreta</strong> para todos os compartilhamentos.
                </Tooltip>
            case 'delete':
                return <Tooltip>
                    <strong>Tome cuidado!</strong> essa ação irá mover {this.props.type === 'folder' ? 'todas as pastas' : 'todos os arquivos'} para a lixeira.
                </Tooltip>
            case 'protect':
                return <Tooltip>
                    Essa ação deixará {this.props.type === 'folder' ? 'a pasta' : 'o arquivo'} protegido, ou seja, você não poderá renomear, mover, excluir, compartilhar e etc.
                </Tooltip>
            case 'block':
                return <Tooltip>
                    O bloqueio permite controlar o acesso {this.props.type === 'folder' ? 'as pastas' : 'aos arquivos'}, determinando data, hora, dia da semana e etc, que {this.props.type === 'folder' ? 'a pasta não poderá ser acessada.' : 'o arquivo não poderá ser acessado.'}
                </Tooltip>
            case 'moveToFolder':
                return <Tooltip>
                    Essa ação irá mover {this.props.type === 'folder' ? 'a pasta' : 'o arquivo'} para uma pasta específica.
                </Tooltip>
            case 'download':
                return <Tooltip>
                    Você efetuará o download da versão mais recente de cada arquivo selecionado.
                </Tooltip>
            default:
                return <Tooltip>
                    <strong>???</strong>
                </Tooltip>
        }
    }

    render() {
        return (
            <>
                {this.render_box()}
                <div className='d-flex flex-row justify-content-center align-items-center my-2 px-2 border bg-light-gray' style={{ height: 35 }}>
                    <div className='text-center col-1'>
                        <div className="form-check my-auto d-flex flex-row justify-content-center align-items-center">
                            <input
                                className="form-check-input my-auto"
                                type="checkbox"
                                value=""
                                checked={this.props.type === 'folder' ? this.context.hasSelectedAllFolderItensAction() : this.context.hasSelectedAllFileItensAction()}
                                onChange={(e) => this.props.type === 'folder' ? this.context.defineSelectedAllFolderItensAction(e.target.checked) : this.context.defineSelectedAllFileItensAction(e.target.checked)}
                            />
                        </div>
                    </div>
                    <div className='d-flex flex-row col-11 col-md text-center justify-content-center align-items-center'>
                        <div className='col-5 text-center border-start'>
                            <p className='my-auto fw-bold text-truncate'>
                                Ações Rápidas
                            </p>
                        </div>
                        <div className='col-1 p-2 m-2'>
                            <OverlayTrigger
                                key='bottom'
                                placement={'bottom'}
                                overlay={this.getTooltip('share')}
                            >
                                <Button variant='link' className='d-flex flex-row justify-content-center align-items-center'>
                                    <FontAwesomeIcon
                                        icon={Icon.render('fas', 'share')}
                                        className={`menuAction-icon ${this.hasItemAction() ? 'enable' : 'disable'}`}
                                    />
                                </Button>
                            </OverlayTrigger>
                        </div>
                        <div className='col-1 p-2 m-2'>
                            <OverlayTrigger
                                key='bottom'
                                placement={'bottom'}
                                overlay={this.getTooltip('delete')}
                            >
                                <Button variant='link' className='d-flex flex-row justify-content-center align-items-center'>
                                    <FontAwesomeIcon
                                        icon={Icon.render('fas', 'trash')}
                                        className={`menuAction-icon ${this.hasItemAction() ? 'enable' : 'disable'}`}
                                    />
                                </Button>
                            </OverlayTrigger>
                        </div>
                        <div className='col-1 p-2 m-2'>
                            <OverlayTrigger
                                key='bottom'
                                placement={'bottom'}
                                overlay={this.getTooltip('protect')}
                            >
                                <Button variant='link' className='d-flex flex-row justify-content-center align-items-center'>
                                    <FontAwesomeIcon
                                        icon={Icon.render('fas', 'lock')}
                                        className={`menuAction-icon ${this.hasItemAction() ? 'enable' : 'disable'}`}
                                    />
                                </Button>
                            </OverlayTrigger>
                        </div>
                        <div className='col-1 p-2 m-2'>
                            <Dropdown>
                                <Dropdown.Toggle
                                    variant="transparent"
                                    className='col-12 p-0 bg-transparent text-primary border-0'
                                    disabled={this.hasItemAction() ? false : true}
                                />
                                <Dropdown.Menu align={'end'} className='overflow-auto' style={{ maxHeight: 125 }}>
                                    {
                                        this.props.type === 'folder' ?
                                            this.getOptions('folder') :
                                            this.getOptions('file')
                                    }
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    render_box() {
        const
            count = this.props.type === 'folder' ? this.context.countFolderItemAction() : this.context.countFileItemAction(),
            countFolder = this.context.countFolderItemAction(),
            countFile = this.context.countFileItemAction();

        return (
            <div className={`menuAction-box ${count > 0 ? 'active' : 'deactivate'} d-flex flex-row ${countFolder > 0 && countFile ? this.props.type === 'folder' ? 'justify-content-start' : 'justify-content-end' : 'justify-content-center'} align-items-center fixed-top m-2 p-2`}>
                <div
                    className={`d-flex flex-column justify-content-center align-items-center ${countFolder > 0 && countFile ? 'col-5' : 'col-12'} border rounded bg-light-gray shadow p-2`}
                >
                    <div className='d-flex flex-row col-12 justify-content-center'>
                        <p className='fw-bold my-auto'>{`${count} ${this.props.type === 'folder' ? `Pasta(s) selecionada(s)` : `Arquivo(s) selecionado(s)`}`}</p>
                    </div>
                </div>
            </div>
        )
    }
}
