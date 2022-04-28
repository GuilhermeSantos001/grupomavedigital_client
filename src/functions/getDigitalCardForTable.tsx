import { Columns, RowData } from '@/components/lists/ListWithCheckbox';

import { CardInfo } from '@/src/generated/graphql'

import { uploadTempDownload, uploadDownload } from '@/src/functions/getUploads'

import NextLink from 'next/link'
import Link from '@mui/material/Link';

import Button from '@mui/material/Button';
import PreviewIcon from '@mui/icons-material/Preview';

export default function getDigitalCardForTable(
  cards: CardInfo[]
) {
  const
    columns: Columns = [
      {
        field: 'id',
        align: 'center',
        hidden: true,
      },
      {
        field: 'item',
        title: 'Item',
        align: 'center'
      },
      {
        field: 'view',
        title: 'Visualizar',
        align: 'center',
        render: (rowData: RowData) => {
          return (
            <NextLink href={`/cards/view/${rowData.id}`}>
              <Link href={`/cards/view/${rowData.id}`} target="_blank">
                <PreviewIcon />
              </Link>
            </NextLink>
          )
        }
      },
      {
        field: 'version',
        title: 'Versão',
        align: 'center'
      },
      {
        field: 'name',
        title: 'Nome',
        align: 'center'
      },
      {
        field: 'jobtitle',
        title: 'Cargo',
        align: 'center'
      },
      {
        field: 'phones',
        title: 'Telefones',
        align: 'center'
      },
      {
        field: 'whatsapp',
        title: 'Whatsapp',
        align: 'center'
      },
      {
        field: 'photo',
        title: 'Foto',
        align: 'center',
        render: (row: RowData) => {
          return (
            <Button color="inherit" onClick={async () => {
              const { id, name, type } = row.photo;
              uploadDownload(name, type, id);
            }}>
              Baixar
            </Button>
          )
        }
      },
      {
        field: 'logo',
        title: 'Logo',
        align: 'center',
        render: (row: RowData) => {
          return (
            <Button color="inherit" onClick={async () => {
              const { id, name, type } = row.logo;
              uploadDownload(name, type, id);
            }}>
              Baixar
            </Button>
          )
        }
      },
      {
        field: 'attachment',
        title: 'Apresentação Comercial',
        align: 'center',
        render: (row: RowData) => {
          return (
            <Button color="inherit" onClick={async () => {
              const { id, name, type } = row.attachment;
              uploadDownload(name, type, id);
            }}>
              Baixar
            </Button>
          )
        }
      },
      {
        field: 'vcard',
        title: 'VCard',
        align: 'center',
        render: (row: RowData) => {
          return (
            <Button color="inherit" onClick={() => {
              const { path, name, type } = row.vcard;
              uploadTempDownload(path, name, type);
            }}>
              Baixar
            </Button>
          )
        }
      }
    ],
    rows: RowData[] = cards.map((card, index) => {
      return {
        id: card.cid,
        item: index + 1,
        version: card.version,
        name: card.name,
        jobtitle: card.jobtitle,
        phones: card.phones.join(', '),
        whatsapp: card.whatsapp.phone,
        photo: card.photo,
        logo: card.vcard.logo,
        attachment: card.footer.attachment,
        vcard: {
          ...card.vcard.metadata.file
        },
      }
    });

  return { columns, rows };
}