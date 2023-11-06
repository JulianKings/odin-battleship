import { GameBoard } from "./gameboard";

const mockBoard = new GameBoard();

it('Test generating random board', () => {
    expect(mockBoard.generateBoard()).toBe(true);
});

it('Test placing a ship', () => {
    expect(mockBoard.placeNewShip(1)).toNotBe(false);
});

it('Test attacking a coordinate', () => {
    expect(mockBoard.receiveAttack(0, 0)).toBe(true);
});

it('Test attacking a coordinate again', () => {
    expect(mockBoard.receiveAttack(0, 0)).toBe(false);
});

it('Test if the board has been completely sunk', () => {
    expect(mockBoard.shipsSunk()).toBe(false);
});
