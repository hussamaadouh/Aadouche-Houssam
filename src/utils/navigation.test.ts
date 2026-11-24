import test from 'node:test';
import assert from 'node:assert/strict';
import { getPathForRoute, parseRouteFromLocation } from './navigation';

test('parseRouteFromLocation resolves clean pathnames to dedicated page routes', () => {
  assert.equal(parseRouteFromLocation('/'), 'home');
  assert.equal(parseRouteFromLocation('/historia'), 'story');
  assert.equal(parseRouteFromLocation('/carta/'), 'menu');
  assert.equal(parseRouteFromLocation('/reservas'), 'reservations');
  assert.equal(parseRouteFromLocation('/ubicacion'), 'location');
});

test('parseRouteFromLocation supports legacy hash anchors and defaults unknown paths to home', () => {
  assert.equal(parseRouteFromLocation('/', '#carta'), 'menu');
  assert.equal(parseRouteFromLocation('/', '#reservas'), 'reservations');
  assert.equal(parseRouteFromLocation('/unknown-page'), 'home');
});

test('getPathForRoute returns canonical path strings for all routes', () => {
  assert.equal(getPathForRoute('home'), '/');
  assert.equal(getPathForRoute('story'), '/historia');
  assert.equal(getPathForRoute('menu'), '/carta');
  assert.equal(getPathForRoute('reservations'), '/reservas');
  assert.equal(getPathForRoute('location'), '/ubicacion');
});
