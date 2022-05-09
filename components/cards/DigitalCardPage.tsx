import * as React from 'react'

import Image from 'next/image'

import { css } from '@emotion/css'

import { Card } from 'react-bootstrap'

import { ZoomInDiv } from '@/animations/ZoomInAnimation'
import { ZoomInDownDiv } from '@/animations/ZoomInDownAnimation'
import { BounceInDiv } from '@/animations/BounceInAnimation'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'

import {
  ContactPhone,
  Send,
  MailLock,
  LocationOn,
  Language,
  StickyNote2,
  FacebookRounded,
  YouTube,
  LinkedIn,
  Instagram,
  Twitter,
} from '@mui/icons-material'

import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'

import StringEx from '@/src/utils/stringEx'
import Alerting from '@/src/utils/alerting'

import { uploadTempDownload } from '@/src/functions/getUploads'

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

import { InputDialog } from '@/components/dialogs/InputDialog'

export type LayoutVersions =
  | '1.0'
  | '1.1'
  | '1.2'

export type Props = {
  cid: string
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
  attachmentVCard: string | {
    path: string
    name: string
    type: string
  }
  socialmedia: {
    facebook?: string
    youtube?: string
    linkedin?: string
    instagram?: string
    twitter?: string
    tiktok?: string
    flickr?: string
  }
}

export function DigitalCardPage(props: Props) {
  const [openChoiceInputDialog, setOpenChoiceInputDialog] = React.useState(false);
  const [inputtedValueChiceInputDialog, setInputtedValueChoiceInputDialog] = React.useState('');

  const
    getBackgroundColor = () => {
      switch (props.version) {
        case '1.0':
          return 'bg-primary bg-gradient';
        case '1.1':
          return 'bg-dark bg-gradient';
        case '1.2':
          return 'bg-danger bg-gradient';
        default:
          return 'bg-primary bg-gradient';
      }
    },
    getDividerColor = () => {
      switch (props.version) {
        case '1.0':
        case '1.1':
          return 'bg-secondary bg-gradient';
        case '1.2':
          return 'bg-warning bg-gradient';
        default:
          return 'bg-secondary bg-gradient';
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
    },
    handleOpenChoiceInputDialog = () => setOpenChoiceInputDialog(true),
    onChangeChoiceInputDialog = (value: string) => setInputtedValueChoiceInputDialog(value),
    onCloseChoiceInputDialog = () => setOpenChoiceInputDialog(false),
    onSubmitChoiceInputDialog = (value: string) => {
      setOpenChoiceInputDialog(false);
      window.open(`https://wa.me/55${value}?text=${process.env.NEXT_PUBLIC_HOST}/cards/view/${props.cid} \n\r ${props.whatsapp.message}`, '_blank');
    };

  return (
    <Card className={`digitalCard d-flex col-12 ${getBackgroundColor()} bg-gradient`} style={{ height: '100vh' }}>
      <Card.Body style={{ height: '100vh' }}>
        <ZoomInDiv duration='800ms'>
          <div className="d-flex mt-2 p-2 justify-content-center align-items-center">
            <a href="https://grupomave.com.br" rel="noreferrer" target={'_blank'}>
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
            <div className="d-flex flex-column flex-md-row align-self-center justify-content-center py-3">
              <Avatar
                alt={props.username}
                className="mx-auto"
                src={typeof props.photoProfile !== 'string' && props.photoProfile.raw.length > 0 ? props.photoProfile.raw : `/uploads/${props.photoProfile}`}
                sx={{ width: 150, height: 150 }}
              />
            </div>
            <p className={`text-center fw-bold fst-italic ${getColorText()}`}>
              {props.username} <br />
              {props.jobtitle}
            </p>
          </ZoomInDownDiv>
          <BounceInDiv duration='1s'>
            <div className='d-flex justify-content-center align-items-center my-3'>
              <Button
                className="col-6 col-md-8 mx-auto whatsapp"
                variant={getColorButtons()}
                color="success"
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
            <div className='d-flex justify-content-center align-items-center my-3'>
              <Button className="col-5 mx-2 phone"
                variant={getColorButtons()} startIcon={
                  <FontAwesomeIcon
                    icon={Icon.render('fas', 'square-phone')}
                    className="me-2 flex-shrink-1 my-auto"
                  />
                }
                onClick={() => window.open(`tel:55${props.workPhone}`)}
              >
                {StringEx.maskPhone(props.workPhone, 'tel')}
              </Button>
              <Button className="col-5 mx-2 phone" variant={getColorButtons()} startIcon={
                <FontAwesomeIcon
                  icon={Icon.render('fas', 'square-phone')}
                  className="me-2 flex-shrink-1 my-auto"
                />
              }
                onClick={() => window.open(`tel:55${props.cellPhone}`)}
              >
                {StringEx.maskPhone(props.cellPhone, 'cell')}
              </Button>
            </div>
          </BounceInDiv>
          <BounceInDiv duration='1s'>
            <InputDialog
              title='Compartilhamento instantâneo via WhatsApp'
              message='Digite o número do seu WhatsApp para compartilhar o conteúdo da página.'
              open={openChoiceInputDialog}
              inputtedValue={inputtedValueChiceInputDialog}
              onChange={onChangeChoiceInputDialog}
              onSubmit={onSubmitChoiceInputDialog}
              onClose={onCloseChoiceInputDialog}
              input={{
                id: 'inputChoiceInputDialog',
                label: 'Número do Celular com +DDD',
                type: 'phone',
                length: 11,
              }}
            />
            <div className='d-flex justify-content-center align-items-center my-3'>
              <Button
                className={`col-5 col-md-4 mx-2  text-primary fw-bold actions`}
                variant={getColorButtons()}
                color="inherit"
                startIcon={<ContactPhone fontSize='small' />}
                onClick={() => {
                  if (typeof props.attachmentVCard !== 'string') {
                    const { name, type } = props.attachmentVCard;
                    window.open(`${process.env.NEXT_PUBLIC_EXPRESS_HOST!}/temp/${name}${type}`);
                  } else {
                    Alerting.create('info', 'Cartão de contato ainda não está disponível');
                  }
                }}
              >
                Salvar em Contatos
              </Button>
              <Button
                className={`col-5 col-md-4 mx-2 text-primary fw-bold actions`}
                variant={getColorButtons()}
                color="inherit"
                startIcon={<Send fontSize="small" />}
                onClick={handleOpenChoiceInputDialog}
              >
                Envie por WhatsApp
              </Button>
            </div>
          </BounceInDiv>
          <div className={`col-12 ${getDividerColor()}`} style={{ height: '1vh' }} />
        </div>
        <div className="d-flex flex-column justify-content-center align-items-center">
          {
            Object.values(props.socialmedia).length > 0 &&
            <BounceInDiv duration='1s'>
              <div className="d-flex flex-row align-self-center justify-content-end my-2">
                {
                  props.socialmedia.facebook &&
                  <Tooltip title="Acesse nossa pagina" arrow>
                    <IconButton
                      className={"hover-color hover-light"}
                      aria-label="Facebook"
                      onClick={() => window.open(props.socialmedia.facebook)}
                    >
                      <FacebookRounded />
                    </IconButton>
                  </Tooltip>
                }
                {
                  props.socialmedia.youtube &&
                  <Tooltip title="Inscreva-se em nosso canal" arrow>
                    <IconButton
                      className={"hover-color hover-light"}
                      aria-label="Youtube"
                      onClick={() => window.open(props.socialmedia.youtube)}
                    >
                      <YouTube />
                    </IconButton>
                  </Tooltip>
                }
                {
                  props.socialmedia.linkedin &&
                  <Tooltip title="Trabalhe conosco" arrow>
                    <IconButton
                      className={"hover-color hover-light"}
                      aria-label="Linkedin"
                      onClick={() => window.open(props.socialmedia.linkedin)}
                    >
                      <LinkedIn />
                    </IconButton>
                  </Tooltip>
                }
                {
                  props.socialmedia.instagram &&
                  <Tooltip title="Acompanhe nossa trajetória" arrow>
                    <IconButton
                      className={"hover-color hover-light"}
                      aria-label="Instagram"
                      onClick={() => window.open(props.socialmedia.instagram)}
                    >
                      <Instagram />
                    </IconButton>
                  </Tooltip>
                }
                {
                  props.socialmedia.twitter &&
                  <Tooltip title="Saiba o que estamos pensando" arrow>
                    <IconButton
                      className={"hover-color hover-light"}
                      aria-label="Twitter"
                      onClick={() => window.open(props.socialmedia.twitter)}
                    >
                      <Twitter />
                    </IconButton>
                  </Tooltip>
                }
                {
                  props.socialmedia.tiktok &&
                  <Tooltip title="Saiba o que estamos pensando" arrow>
                    <IconButton
                      className={"hover-color hover-light"}
                      aria-label="TikTok"
                      onClick={() => window.open(props.socialmedia.tiktok)}
                    >
                      <FontAwesomeIcon
                        icon={Icon.render('fab', 'tiktok')}
                        className="me-2 fs-6 flex-shrink-1 my-auto"
                      />
                    </IconButton>
                  </Tooltip>
                }
                {
                  props.socialmedia.flickr &&
                  <Tooltip title="Veja o que nossos artistas estão compartilhando" arrow>
                    <IconButton
                      className={"hover-color hover-light"}
                      aria-label="Flickr"
                      onClick={() => window.open(props.socialmedia.flickr)}
                    >
                      <FontAwesomeIcon
                        icon={Icon.render('fab', 'flickr')}
                        className="me-2 fs-6 flex-shrink-1 my-auto"
                      />
                    </IconButton>
                  </Tooltip>
                }
              </div>
            </BounceInDiv>
          }
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
                  onClick={() => window.open(props.website.slice(0, 4).includes('http') ? props.website : `https://${props.website}`)}
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
                  url={`${process.env.NEXT_PUBLIC_HOST}/cards/view/${props.cid} \n\r ${props.whatsapp.message}`}
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
                  url={`${process.env.NEXT_PUBLIC_HOST}/cards/view/${props.cid} \n\r ${props.whatsapp.message}`}
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
                  url={`${process.env.NEXT_PUBLIC_HOST}/cards/view/${props.cid} \n\r ${props.whatsapp.message}`}
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
                  url={`${process.env.NEXT_PUBLIC_HOST}/cards/view/${props.cid} \n\r ${props.whatsapp.message}`}
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
                  url={`${process.env.NEXT_PUBLIC_HOST}/cards/view/${props.cid} \n\r ${props.whatsapp.message}`}
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
        </div>
      </Card.Body>
    </Card>
  )
}