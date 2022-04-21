const
    FilesSocketEventsListenerAndEmitter = {
        FILE_UPLOAD_ATTACHMENT: 'FILE-UPLOAD-ATTACHMENT',
        FILE_DELETE_ATTACHMENT: 'FILE-DELETE-ATTACHMENT',
        FILE_CHANGE_TYPE_ATTACHMENT: 'FILE-CHANGE-TYPE-ATTACHMENT',
    },
    PaybackSocketEventsListenerAndEmitter = {
        PAYBACK_UPLOAD_COVERING_MIRROR: 'PAYBACK-UPLOAD-COVERING-MIRROR',
        PAYBACK_UPLOAD_COVERAGE_MIRROR: 'PAYBACK-UPLOAD-COVERAGE-MIRROR',
    },
    DigitalCardsSocketEventsListenerAndEmitter = {
        DIGITAL_CARDS_UPLOAD_USER_PHOTO: 'DIGITAL-CARDS-UPLOAD-USER-PHOTO',
        DIGITAL_CARDS_UPLOAD_USER_LOGOTIPO: 'DIGITAL-CARDS-UPLOAD-USER-LOGOTIPO',
        DIGITAL_CARDS_UPLOAD_ATTACHMENT_BUSINESS: 'DIGITAL-CARDS-UPLOAD-BUSINESS',
    }

export { FilesSocketEventsListenerAndEmitter as FilesSocketEvents }
export { PaybackSocketEventsListenerAndEmitter as PaybackSocketEvents }
export { DigitalCardsSocketEventsListenerAndEmitter as DigitalCardsSocketEvents }