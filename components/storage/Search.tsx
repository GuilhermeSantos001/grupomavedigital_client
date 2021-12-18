/**
 * @description Componentes da barra de pesquisa do GED
 * @author @GuilhermeSantos001
 * @update 08/12/2021
 */

import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

type MyProps = {
    type: keyof IText
    handleChangeFolderText?: (text: string) => void
    handleChangeFileText?: (text: string) => void
}

type MyStates = {
    text: IText
}

declare interface IText {
    folder: string
    file: string
}

export default class Search extends React.Component<MyProps, MyStates> {
    constructor(props) {
        super(props)

        this.state = {
            text: {
                folder: '',
                file: ''
            }
        }

        this.handleChangeText = this.handleChangeText.bind(this)
    }

    handleChangeText = (text: string) => {
        this.setState({ text: { ...this.state.text, [this.props.type]: text } })

        if (this.props.type === 'folder')
            this.props.handleChangeFolderText(text)
        else if (this.props.type === 'file')
            this.props.handleChangeFileText(text)
    }

    render() {
        return (
            <div className='d-flex flex-row justify-content-center align-items-center p-2 my-2 border bg-light-gray'>
                <div className='col-1 text-center border-end'>
                    <FontAwesomeIcon
                        icon={Icon.render('fas', 'search')}
                        className="mx-auto my-auto fs-5 flex-shrink-1 text-primary"
                    />
                </div>
                <div className='col'>
                    <input type="text"
                        className="form-control form-control-sm"
                        aria-describedby="search-text"
                        value={this.state.text[this.props.type]}
                        onChange={(e) => this.handleChangeText(e.target.value)}
                    />
                </div>
            </div>
        )
    }
}
