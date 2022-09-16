import React, { useState, useEffect } from 'react'

import { Row, Col } from 'antd'

import LayoutWithSession from '@/containers/_global/_pages/_layout-with-session'
import Menu from '@/containers/Dashboard/menu'

import useUser from '@/atom/user'

import * as _ from 'lodash'

export default function Component() {
  const user = useUser()

  return (
    <LayoutWithSession menu={Menu}>
      <Row gutter={24}>
        <Col span={24}>
          <p>Hello {user.get().username}</p>
        </Col>
      </Row>
    </LayoutWithSession>
  )
}
