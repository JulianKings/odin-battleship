import { Ship } from "./ship";

const Mock = new Ship(3, 0);

it('Test hit', () => {
    expect(Mock.hit()).toBe(true);
});

it('Check sink status', () => {
    expect(Mock.isSunk()).toBe(false);
});

it('Test sunk', () => {
    Mock.hit(); Mock.hit();
    expect(Mock.hit()).toBe(false);
});

it('Check sink status', () => {
    expect(Mock.isSunk()).toBe(true);
});