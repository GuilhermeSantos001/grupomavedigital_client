import * as React from 'react';

import Image from 'next/image'

import { css } from '@emotion/css'

import { Card } from 'react-bootstrap';

import { ZoomInDiv } from '@/animations/ZoomInAnimation';
import { ZoomInDownDiv } from '@/animations/ZoomInDownAnimation';
import { BounceInDiv } from '@/animations/BounceInAnimation';

import Button from '@mui/material/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import {
  MailLock,
  LocationOn,
  Language,
  StickyNote2
} from '@mui/icons-material';

import Tooltip from '@mui/material/Tooltip';

import StringEx from '@/src/utils/stringEx';

import {
  TelegramShareButton,
  TelegramIcon,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
  LinkedinShareButton,
  LinkedinIcon
} from "react-share";

export type LayoutVersions =
  | '1.0'
  | '1.1'
  | '1.2'

export type Props = {
  version: LayoutVersions
  photoProfile: string | { raw: string, id: string }
  username: string
  jobtitle: string
  whatsapp: {
    phone: string
    text: string
    message: string
  }
  workPhone: string
  cellPhone: string
  mail: string
  googleMapsLink: string
  website: string
  attachmentBusiness: string | { raw: string }
}

export function DigitalCardPage(props: Props) {
  const
    getBackgroundColor = () => {
      switch (props.version) {
        case '1.0':
          return 'bg-primary';
        case '1.1':
          return 'bg-dark';
        case '1.2':
          return 'bg-danger';
        default:
          return 'bg-primary';
      }
    },
    getDividerColor = () => {
      switch (props.version) {
        case '1.0':
        case '1.1':
          return 'bg-secondary';
        case '1.2':
          return 'bg-warning';
        default:
          return 'bg-secondary';
      }
    },
    getColorText = () => {
      switch (props.version) {
        case '1.0':
          return 'text-primary';
        case '1.1':
          return 'text-dark';
        case '1.2':
          return 'text-danger';
        default:
          return 'text-primary';
      }
    },
    getColorFooterText = () => {
      switch (props.version) {
        case '1.0':
        case '1.1':
          return 'text-secondary';
        case '1.2':
          return 'text-white';
        default:
          return 'text-primary';
      }
    },
    getColorButtons = (): "text" | "outlined" | "contained" => {
      switch (props.version) {
        case '1.0':
        case '1.1':
          return 'contained';
        case '1.2':
          return 'outlined';
        default:
          return 'contained';
      }
    }

  return (
    <Card className={`d-flex col-12 p-0 rounded ${getBackgroundColor()} bg-gradient`}>
      <Card.Body className="p-0 rounded">
        <ZoomInDiv duration='800ms'>
          <div className="d-flex mt-2 p-2 justify-content-center align-items-center">
            <a href="https://grupomave.com.br" target={'_blank'}>
              <Image
                className="cursor-pointer"
                src="/assets/logo.png"
                alt="Grupo Mave"
                priority={true}
                width={340}
                height={90}
              />
              <h6 className={`text-center ${getColorFooterText()}`}>
                Você e seu patrimônio em boas mãos!
              </h6>
            </a>
          </div>
        </ZoomInDiv>
        <div className={`col-12 bg-light-gray`}>
          <div className={`col-12 ${getDividerColor()}`} style={{ height: '1vh' }} />
          <ZoomInDownDiv duration='750ms'>
            <div className="d-flex flex-column flex-md-row align-self-center justify-content-center rounded py-3">
              <Image
                src={typeof props.photoProfile !== 'string' && props.photoProfile.raw.length > 0 ? props.photoProfile.raw : `/uploads/${props.photoProfile}`}
                alt={props.username}
                className="rounded-circle"
                width={150}
                height={150}
              />
            </div>
            <p className={`text-center fw-bold fst-italic ${getColorText()}`}>
              {props.username} <br />
              {props.jobtitle}
            </p>
          </ZoomInDownDiv>
          <BounceInDiv duration='1s'>
            <div className='d-flex justify-content-center align-items-center mb-2'>
              <Button
                className="col-8 mx-auto"
                variant={getColorButtons()}
                color="success"
                style={{ fontSize: 10 }}
                onClick={() => {
                  window.open(`https://api.whatsapp.com/send?phone=55${props.whatsapp.phone}&text=${props.whatsapp.text}`, '_blank');
                }}
                startIcon={
                  <FontAwesomeIcon
                    icon={Icon.render('fab', 'whatsapp')}
                    className="me-2 fs-3 flex-shrink-1 my-auto"
                  />
                }
              >
                Entrar em Contato
              </Button>
            </div>
            <div className='d-flex justify-content-center align-items-center mb-2'>
              <Button className="col-5 mx-2" variant={getColorButtons()} startIcon={
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'square-phone')}
                  className="me-2 flex-shrink-1 my-auto"
                />
              }
                style={{ fontSize: 10 }}
                onClick={() => window.open(`tel:55${props.workPhone}`)}
              >
                {StringEx.maskPhone(props.workPhone)}
              </Button>
              <Button className="col-5 mx-2" variant={getColorButtons()} startIcon={
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'square-phone')}
                  className="me-2 flex-shrink-1 my-auto"
                />
              }
                style={{ fontSize: 10 }}
                onClick={() => window.open(`tel:55${props.cellPhone}`)}
              >
                {StringEx.maskPhone(props.cellPhone)}
              </Button>
            </div>
          </BounceInDiv>
          <div className={`col-12 ${getDividerColor()}`} style={{ height: '1vh' }} />
        </div>
        <div className="d-flex flex-column my-3 justify-content-center align-items-center">
          <div className="d-flex mb-2 justify-content-center align-items-center">
            <ZoomInDiv duration='800ms'>
              <Tooltip title="Enviar mensagem por e-mail" arrow>
                <Button
                  className={`col mx-1 p-2 ${getColorFooterText()}`}
                  variant="outlined"
                  color="secondary"
                  onClick={() => window.open(`mailto:${props.mail}`)}
                >
                  <MailLock fontSize='small' />
                </Button>
              </Tooltip>
            </ZoomInDiv>
            <ZoomInDiv duration='800ms'>
              <Tooltip title="Encontrar rotas até o Grupo Mave" arrow>
                <Button
                  className={`col mx-1 p-2 ${getColorFooterText()}`}
                  variant="outlined"
                  color="secondary"
                  onClick={() => window.open(props.googleMapsLink)}
                >
                  <LocationOn fontSize='small' />
                </Button>
              </Tooltip>
            </ZoomInDiv>
            <ZoomInDiv duration='800ms'>
              <Tooltip title="Navegar no site" arrow>
                <Button
                  className={`col mx-1 p-2 ${getColorFooterText()}`}
                  variant="outlined"
                  color="secondary"
                  onClick={() => window.open(props.website.slice(0, 4).includes('http') ? props.website : `http://${props.website}`)}
                >
                  <Language fontSize='small' />
                </Button>
              </Tooltip>
            </ZoomInDiv>
            <ZoomInDiv duration='800ms'>
              <Tooltip title="Apresentação Comercial" arrow>
                <Button
                  className={`col mx-1 p-2 ${getColorFooterText()}`}
                  variant="outlined"
                  color="secondary"
                  onClick={() => window.open(typeof props.attachmentBusiness !== 'string' && props.attachmentBusiness.raw.length > 0 ?
                    props.attachmentBusiness.raw : '/assets/Apresenta%C3%A7%C3%A3o/APRESENTACAO_MAVE.pdf')
                  }
                >
                  <StickyNote2 fontSize='small' />
                </Button>
              </Tooltip>
            </ZoomInDiv>
          </div>
          <BounceInDiv duration='1s'>
            <p className={`${getColorFooterText()} fw-bold mb-0`}>
              Compartilhe
            </p>
          </BounceInDiv>
          <div className="d-flex justify-content-center align-items-center">
            <BounceInDiv duration='1s'>
              <Tooltip title="Compartilhe no Facebook" arrow>
                <FacebookShareButton
                  url={`${process.env.NEXT_PUBLIC_HOST}/cards/${props.username}\n\r${props.whatsapp.message}`}
                  className="mx-1"
                >
                  <FacebookIcon
                    size={32}
                    round
                    className={`animation-delay ${css`
                  cursor: pointer;
                  &:hover {
                    opacity: 0.75;
                    transform: scale(1.1);
                  }
                `}`}
                  />
                </FacebookShareButton>
              </Tooltip>
            </BounceInDiv>
            <BounceInDiv duration='1s'>
              <Tooltip title="Compartilhe no Twitter" arrow>
                <TwitterShareButton
                  url={`${process.env.NEXT_PUBLIC_HOST}/cards/${props.username}\n\r${props.whatsapp.message}`}
                  className="mx-1"
                >
                  <TwitterIcon
                    size={32}
                    round
                    className={`animation-delay ${css`
                  cursor: pointer;
                  &:hover {
                    opacity: 0.75;
                    transform: scale(1.1);
                  }
                `}`}
                  />
                </TwitterShareButton>
              </Tooltip>
            </BounceInDiv>
            <BounceInDiv duration='1s'>
              <Tooltip title="Compartilhe no Linkedin" arrow>
                <LinkedinShareButton
                  url={`${process.env.NEXT_PUBLIC_HOST}/cards/${props.username}\n\r${props.whatsapp.message}`}
                  className="mx-1"
                >
                  <LinkedinIcon
                    size={32}
                    round
                    className={`animation-delay ${css`
                  cursor: pointer;
                  &:hover {
                    opacity: 0.75;
                    transform: scale(1.1);
                  }
                `}`}
                  />
                </LinkedinShareButton>
              </Tooltip>
            </BounceInDiv>
            <BounceInDiv duration='1s'>
              <Tooltip title="Compartilhe no Telegram" arrow>
                <TelegramShareButton
                  url={`${process.env.NEXT_PUBLIC_HOST}/cards/${props.username}\n\r${props.whatsapp.message}`}
                  className="mx-1"
                >
                  <TelegramIcon
                    size={32}
                    round
                    className={`animation-delay ${css`
                  cursor: pointer;
                  &:hover {
                    opacity: 0.75;
                    transform: scale(1.1);
                  }
                `}`}
                  />
                </TelegramShareButton>
              </Tooltip>
            </BounceInDiv>
            <BounceInDiv duration='1s'>
              <Tooltip title="Compartilhe no Whatsapp" arrow>
                <WhatsappShareButton
                  url={`${process.env.NEXT_PUBLIC_HOST}/cards/${props.username}\n\r${props.whatsapp.message}`}
                  className="mx-1"
                >
                  <WhatsappIcon
                    size={32}
                    round
                    className={`animation-delay ${css`
                  cursor: pointer;
                  &:hover {
                    opacity: 0.75;
                    transform: scale(1.1);
                  }
                `}`}
                  />
                </WhatsappShareButton>
              </Tooltip>
            </BounceInDiv>
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <ZoomInDownDiv duration='750ms'>
              <p className={`text-center my-2 px-2 ${getColorFooterText()} ${css`
                font-size: 0.8rem;
              `}`}>
                Grupo Mave 2020-2022 © Todos direitos reservados.
              </p>
            </ZoomInDownDiv>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}