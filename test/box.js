import test from 'ava'
import React from 'react'
import render from 'react-test-renderer'
import { shallow } from 'enzyme'
import sinon from 'sinon'
import Box from '../src/box'
import * as styles from '../src/styles'
import allPropertiesComponent from '../tools/all-properties-component'
import { propNames } from '../src/enhancers'

test.afterEach.always(() => {
  styles.clear()
})

test.serial('all properties', t => {
  const component = allPropertiesComponent()
  const tree = render.create(component).toJSON()
  t.snapshot(tree, 'DOM')
  t.snapshot(styles.getAll(), 'CSS')
})

test.serial('all properties set to inherit', t => {
  const properties = {}
  for (const name of propNames) {
    properties[name] = 'inherit'
  }
  delete properties.clearfix // Non-css property
  const component = <Box {...properties} />
  shallow(component)
  t.snapshot(styles.getAll(), 'CSS')
})

test.serial('all properties set to initial', t => {
  const properties = {}
  for (const name of propNames) {
    properties[name] = 'initial'
  }
  delete properties.clearfix // Non-css property
  const component = <Box {...properties} />
  shallow(component)
  t.snapshot(styles.getAll(), 'CSS')
})

test('is prop allows changing the dom element type', t => {
  const component = shallow(<Box is="h1" />)
  t.true(component.is('h1'))
})

test('is prop allows changing the component type', t => {
  function TestComponent(props) {
    return <h1 {...props} />
  }
  const component = shallow(<Box is={TestComponent} />)
  t.true(component.is(TestComponent))
})

test('css prop renders a glamor class', t => {
  const component = shallow(<Box css={{ height: '10px' }} />)
  t.true(component.hasClass('css-882mhe'))
})

test('innerRef prop gets passed the ref', t => {
  const node = { domNode: true }
  const innerRef = sinon.spy()
  render.create(<Box innerRef={innerRef} />, {
    createNodeMock() {
      return node
    }
  })
  t.true(innerRef.calledOnce)
  t.is(innerRef.args[0][0], node)
})

test('renders children', t => {
  const component = shallow(
    <Box>
      <h1>Hi</h1>
    </Box>
  )
  t.true(component.contains(<h1>Hi</h1>))
})

test('flushes styles on update', t => {
  const component = shallow(<Box width="20px" />)
  t.is(
    styles.getStyleSheet(),
    `
.uibox_w_20px {
  width: 20px;
}`
  )
  component.setProps({ height: '20px' })
  t.is(
    styles.getStyleSheet(),
    `
.uibox_w_20px {
  width: 20px;
}
.uibox_h_20px {
  height: 20px;
}`
  )
})
