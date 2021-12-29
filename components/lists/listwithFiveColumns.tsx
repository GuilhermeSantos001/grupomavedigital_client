/**
 * @description Lista -> Lista com 5 colunas
 * @author @GuilhermeSantos001
 * @update 29/12/2021
 */

import { useState } from 'react'

import { Button, OverlayTrigger, Popover } from 'react-bootstrap'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Icon from '@/src/utils/fontAwesomeIcons'
import { IconName, IconPrefix } from '@fortawesome/fontawesome-common-types'

declare type Size = '' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12'

declare type Column = {
  title: string
  size: Size
}

declare type Values = {
  data: string
  size: Size
}

declare type Action = {
  title?: string
  icon: {
    prefix: IconPrefix,
    name: IconName
  }
  enabled: boolean
  handleClick: (items?: string[]) => void
  popover?: {
    title: string
    description: string
  }
}

declare type Line = {
  id: string
  values: Values[]
  actions: Action[]
}

declare type ActionMenu = {
  actions: Action[]
}

export type Props = {
  columns: Column[]
  lines: Line[]
  actionMenu: ActionMenu
  noItemsMessage: string
  pagination: {
    page: number
    limit: number
    paginationLimit: number
  }
}

const ListwithFiveColumns = (props: Props): JSX.Element => {
  const [selected, setSelected] = useState<string[]>([])
  const [allSelected, setAllSelected] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(props.pagination.page)
  const [currentJumpPaginationExceed, setCurrentJumpPaginationExceed] = useState<number>(1)
  const [textSearch, setTextSearch] = useState<string>('')

  const
    resetSelections = () => {
      setSelected([])
      setAllSelected(false);
    },
    actionMenu = (
      <div className={`card w-50 bg-light-gray shadow rounded fixed-top my-2 mx-auto fade-effect ${selected.length > 0 ? 'active' : 'deactivate'}`}>
        <div className="card-body p-0">
          <p className='bg-primary bg-gradient fw-bold fs-3 text-secondary text-center border-bottom p-2'>
            Ações
          </p>
          <p className='col-12 text-muted fw-bold text-center' style={{ fontSize: 14 }}>
            Itens selecionados: {selected.length}
          </p>
          <div className='d-flex flex-row justify-content-center m-2'>
            {props.actionMenu.actions.map((action, index) => {
              return <p key={index} className='mx-2 fw-bold'>
                <FontAwesomeIcon
                  icon={Icon.render(action.icon.prefix, action.icon.name)}
                  className={`me-2 fs-3 flex-shrink-1 my-auto ${action.enabled ? 'hover-color' : 'text-muted'}`}
                  onClick={() => {
                    if (action.enabled) {
                      action.handleClick(selected);
                      resetSelections();
                    }
                  }}
                /> {action.title}
              </p>
            })}
          </div>
        </div>
      </div>
    );

  const
    totalPerPage = props.pagination.limit,
    totalPagination = props.pagination.paginationLimit,
    filterLines = props.lines.filter(line => {
      if (
        textSearch.length > 0
      ) {
        if (line.values.filter(value => value.data.includes(textSearch)).length > 0)
          return true;
        else
          return false;
      }
      else
        return true;
    });

  let
    totalPages = filterLines.length / totalPerPage;

  if (!Number.isInteger(totalPages))
    totalPages = Math.ceil(totalPages);

  const
    lines = filterLines.slice((currentPage - 1) * totalPerPage, currentPage * totalPerPage),
    totalJumpPaginationExceed = totalPages / totalPagination,
    exceedPagination = () => totalPages > totalPagination,
    handlePageChange = (page: number) => {
      window.scrollTo(0, 0);
      setCurrentPage(page <= totalPages ? page : totalPages);
      resetSelections();
    },
    handlePreviousPaginationExceed = () => {
      if (currentJumpPaginationExceed > 1) {
        const
          jump = currentJumpPaginationExceed - 1,
          nextPage = (totalPagination * jump);

        setCurrentJumpPaginationExceed(jump);
        handlePageChange(nextPage);
      }
    },
    handleNextPaginationExceed = () => {
      if (currentJumpPaginationExceed < totalJumpPaginationExceed) {
        const
          jump = currentJumpPaginationExceed + 1,
          nextPage = (totalPagination * jump) - totalPagination;

        setCurrentJumpPaginationExceed(jump);
        handlePageChange(nextPage + 1);
      }
    },
    handleSetPaginationExceed = (jump: number, previous?: boolean) => {
      let
        nextPage = (totalPagination * jump) - totalPagination;

      if (previous)
        nextPage = (totalPagination * jump);

      setCurrentJumpPaginationExceed(jump);
      handlePageChange(!previous ? nextPage + 1 : nextPage);
    },
    hasFirstPagination = (page: number) => page - 1 <= (totalPagination * currentJumpPaginationExceed) - totalPagination,
    hasLastPagination = (page: number) => page >= (totalPagination * currentJumpPaginationExceed),
    hasPreviousPage = () => currentPage > 1,
    hasNextPage = () => {
      if (!Number.isInteger(totalPages)) {
        return (currentPage + 1) < totalPages;
      } else {
        return currentPage < totalPages;
      }
    },
    getFirstPagination = () => {
      const
        page = (totalPagination * currentJumpPaginationExceed) - totalPagination;

      return page + 1;
    },
    getLastPagination = () => {
      const
        page = (totalPagination * currentJumpPaginationExceed);

      if (page > totalPages)
        return totalPages;

      return page;
    }

  return (
    <>
      {actionMenu}
      <ul className="list-group col-12 p-2 my-2">
        <li className="list-group-item d-flex flex-row bg-primary bg-gradient text-white">
          <input
            className="form-check-input col-1 my-auto"
            type="checkbox"
            value=""
            checked={allSelected}
            disabled={lines.length === 0}
            onChange={(e) => {
              if (e.target.checked) {
                setSelected(lines.map(line => line.id))
                setAllSelected(true);
              }
              else {
                setSelected([])
                setAllSelected(false);
              }
            }}
          />
          {props.columns.map((column, index) => {
            return <b key={index} className={`col-${column.size} py-2 text-center mx-2 text-truncate`}>
              {column.title}
            </b>
          })}
        </li>
        <li className="list-group-item d-flex flex-row bg-light-gray bg-gradient text-primary">
          <div className="input-group input-group-sm m-2">
            <span className="input-group-text" id="search-addon">
              <FontAwesomeIcon
                icon={Icon.render('fas', 'search')}
                className={'flex-shrink-1 text-primary m-auto'}
              />
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Procurar..."
              aria-label="Procurar..."
              aria-describedby="search-addon"
              value={textSearch}
              onChange={(e) => {
                if (currentPage > 1) {
                  setCurrentJumpPaginationExceed(1);
                  setCurrentPage(1);
                }

                if (selected.length > 0)
                  resetSelections();

                setTextSearch(e.target.value)
              }}
            />
          </div>
        </li>
        {
          lines.length > 0 ?
            lines.map((line, index) => {
              return (
                <li key={index} className="list-group-item list-group-item-action d-flex flex-row bg-light-gray bg-gradient text-primary">
                  <input
                    className="form-check-input col-1 my-auto"
                    type="checkbox"
                    value=""
                    checked={selected.includes(line.id)}
                    onChange={() => selected.includes(line.id) ? setSelected(selected.filter(id => id !== line.id)) : setSelected([...selected, line.id])}
                  />
                  {line.values.map((value, index2) => {
                    return <b key={index2} className={`col-${value.size} py-2 text-center mx-2 my-auto text-truncate`}>
                      {value.data}
                    </b>
                  })}
                  <b className='col py-2 text-end mx-2 text-truncate'>
                    {line.actions.map((action, index3) => {
                      return (
                        <OverlayTrigger key={index3} trigger={['focus', 'hover']} placement="auto" overlay={
                          <Popover id={`popover-action-buttom-${index3}`}>
                            <Popover.Header as="h3">
                              {action.popover.title}
                            </Popover.Header>
                            <Popover.Body>
                              {action.popover.description}
                            </Popover.Body>
                          </Popover>
                        }>
                          <Button variant="link">
                            <FontAwesomeIcon
                              icon={Icon.render(action.icon.prefix, action.icon.name)}
                              className={`fs-3 flex-shrink-1 m-auto ${action.enabled ? 'hover-color' : 'text-muted'}`}
                              onClick={() => {
                                if (action.enabled)
                                  return action.handleClick();
                              }}
                            />
                          </Button>
                        </OverlayTrigger>
                      )
                    })}
                  </b>
                </li>
              )
            }) :
            <p className='text-muted text-center p-2'>{props.noItemsMessage}</p>
        }
      </ul>
      <nav aria-label="Page navigation">
        <div className='d-flex flex-row px-5'>
          <p className='text-muted p-2 w-100'>
            😃 Exibindo {getFirstPagination()} de {getLastPagination()} Resultados!
          </p>
          <ul className="pagination flex-shrink-1">
            <li className={`page-item ${hasPreviousPage() ? '' : 'disabled'}`}>
              <a className="page-link hover-color" onClick={() => {
                if (exceedPagination())
                  setCurrentJumpPaginationExceed(1);

                handlePageChange(1);
              }} tabIndex={-1} aria-disabled="true">
                ⏮
              </a>
            </li>
            <li className={`page-item ${hasPreviousPage() ? '' : 'disabled'}`}>
              <a className="page-link hover-color" onClick={() => {
                if (exceedPagination() && hasFirstPagination(currentPage))
                  handlePreviousPaginationExceed();

                handlePageChange(currentPage - 1);
              }} tabIndex={-1} aria-disabled="true">
                ⬅
              </a>
            </li>
            {exceedPagination() && currentJumpPaginationExceed > 1 ?
              <li className='page-item'>
                <a className="page-link hover-color" onClick={() => handlePreviousPaginationExceed()}>
                  ...
                </a>
              </li> : <></>
            }
            {Array.from({ length: totalPages }).map((page, index) => {
              const pageNumber = index + 1;

              let render = false;

              if (exceedPagination() && currentJumpPaginationExceed > 1) {
                if (
                  pageNumber > (totalPagination * currentJumpPaginationExceed) - totalPagination
                  && pageNumber <= totalPagination * currentJumpPaginationExceed
                )
                  render = true;
              } else if (exceedPagination() && currentJumpPaginationExceed <= 1) {
                if (pageNumber <= totalPagination)
                  render = true;
              } else if (!exceedPagination()) {
                render = true;
              }

              if (render)
                return (
                  <li key={index} className={`page-item ${pageNumber === currentPage ? 'active' : ''}`}>
                    <a className="page-link hover-color" onClick={() => handlePageChange(pageNumber)}>
                      {pageNumber}
                    </a>
                  </li>
                )
            })}
            {exceedPagination() ?
              <li className={`page-item ${currentJumpPaginationExceed >= totalJumpPaginationExceed ? 'disabled' : ''}`}>
                <a className="page-link hover-color" onClick={() => handleNextPaginationExceed()}>
                  ...
                </a>
              </li> : <></>
            }
            <li className={`page-item ${hasNextPage() ? '' : 'disabled'}`}>
              <a className='page-link hover-color' onClick={() => {
                if (exceedPagination() && hasLastPagination(currentPage))
                  handleNextPaginationExceed();

                handlePageChange(currentPage + 1);
              }}>
                ➡
              </a>
            </li>
            <li className={`page-item ${hasNextPage() ? '' : 'disabled'}`}>
              <a className='page-link hover-color' onClick={() => {
                if (exceedPagination()) {
                  handleSetPaginationExceed(Math.ceil(totalJumpPaginationExceed));
                }
                else
                  handlePageChange(totalPages);
              }}>
                ⏭
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  )
}

export default ListwithFiveColumns
