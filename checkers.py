from tkinter import *
import random
import math
import copy

master = Tk()
canvas_width = 400
canvas_height = 400
c = Canvas(master, 
           width=canvas_width,
           height=canvas_height)

def onClick(event):
    x = int((event.x-4)/50)
    y = int((event.y-3)/50)

    if(turn == 1):
        red.run(x, y)
    else:
        if(not black.thinking):
            black.run()
    
    draw_board()
            

c.bind("<Button-1>", onClick)

c.pack()

def draw_grid():
    for x in range(8):
        for y in range(8):
            color = "#444"
            if((x+y) % 2 == 0):
                color = "#a33"
            c.create_rectangle(x*50, y*50, (x+1)*50, (y+1)*50, fill = color)


class Piece:
    moves = [] #list of coordinates to move to and type
    isKing = False
    def __init__(self, x, y, color):
        self.x = x
        self.y = y
        self.color = color

    def draw(self):
        if(self.color != "empty"):
            c.create_oval(self.x * 50 + 5, self.y * 50 + 5, (self.x+1)*50-5, (self.y+1)*50-5, fill = self.color)

    def check_angle(self, vx, vy, b):
        color = b[self.x+vx][self.y+vy].color

        if(color == "empty"):
            move = (self.x + vx, self.y + vy, "move")
            if(not move in self.moves):
                self.moves.append(move)
                
        elif (color != self.color and self.x+2*vx >= 0 and self.x+2*vx <= 7 and self.y+2*vy >= 0 and self.y+2*vy <= 7):
            if(b[self.x+2*vx][self.y+2*vy].color == "empty"):
                kill = (self.x + 2*vx, self.y + 2*vy, "kill")
                if(not kill in self.moves):
                    self.moves.append(kill)

    def find_moves(self, b):
        if(self.color != "empty"):
            vy = 1
            if(self.color == "red"):
                vy = -1
            
            if(self.y + vy <= 7 and self.y + vy >= 0):
                if(self.x <= 6):
                    self.check_angle(1, vy, b)
                if(self.x >= 1):
                    self.check_angle(-1, vy, b)

            if(self.isKing):
                if(self.y - vy <= 6 and self.y - vy >= 1):
                    if(self.x <= 6):
                        self.check_angle(1, -vy, b)
                    if(self.x >= 1):
                        self.check_angle(-1, -vy, b)

    def move(self, index, b):
        newX = 0
        newY = 0
        move_type = self.moves[index][2]

        moves = self.moves[index]
        newX = moves[0]
        newY = moves[1]

        if(move_type == "kill"):
            targetX = int((newX+self.x)/2)
            targetY = int((newY+self.y)/2)
            b[targetX][targetY].color = "empty"
        
        b[newX][newY].color = self.color
        b[newX][newY].isKing = self.isKing
        
        b[self.x][self.y].color = "empty"
        b[self.x][self.y].isKing = False
        
        if((newY == 0 and b[newX][newY].color == "red") or (newY == 7 and b[newX][newY].color == "black")):
            b[newX][newY].isKing = True
            print("free pizza")

        self.moves.clear()


board = []
for x in range(8):
    row = []
    for y in range(8):
        if((x+y) % 2 == 0): #red
            row.append(Piece(x, y, "empty"))
        else: #black
            if(y <= 2):
                row.append(Piece(x, y, "black"))
            elif(y >= 5):
                row.append(Piece(x, y, "red"))
            else:
                row.append(Piece(x, y, "empty"))
    board.append(row)            


def draw_board():
    draw_grid()

    for x in range(8):
        for y in range(8):
            board[x][y].draw()
    
    if(turn == 1 and red.selected != None):
        red.draw_moves()
    """elif(turn == -1 and black.selected != None):
        black.draw_moves()"""


class Player():
    def __init__(self, color):
        self.selected = None
        self.hopping = False
        self.color = color

    def draw_moves(self):
        x = self.selected[0]
        y = self.selected[1]

        for moves in board[x][y].moves:
            if(not(moves[2] == "move" and self.hopping)):
                sX = moves[0]
                sY = moves[1]
                c.create_rectangle(sX*50, sY*50, (sX+1)*50, (sY+1)*50, fill = "#666")

    def run(self, x, y):
        global turn

        if(board[x][y].color == self.color and self.selected != (x, y) and not self.hopping):
            self.selected = (x, y)
            board[x][y].moves.clear()
            board[x][y].find_moves(board)
        elif((x, y, "move") in board[x][y].moves and self.selected != None and not self.hopping):
            sX = self.selected[0]
            sY = self.selected[1]
            index = board[sX][sY].moves.index((x, y, "move"))
            board[sX][sY].move(index, board)
            self.selected = None
            turn *= -1
        elif((x, y, "kill") in board[x][y].moves):
            sX = self.selected[0]
            sY = self.selected[1]
            index = board[x][y].moves.index((x, y, "kill"))
            
            board[sX][sY].move(index, board)

            self.hopping = False
            self.selected = None
            board[x][y].moves.clear()
            board[x][y].find_moves(board)
            turn *= -1

            hasKill = False
            for move in board[x][y].moves:
                if(move[2] == "kill"):
                    hasKill = True
            
            if(hasKill):
                self.selected = (x, y)
                self.hopping = True
                turn *= -1

class Bot:
    color = "black"
    depth = 3
    thinking = False

    def score_board(self, b):
        score = 0
        for x in range(8):
            for y in range(8):
                if(b[x][y].color == "red"):
                    score += 1

                    if(b[x][y].isKing):
                        score += .5
                elif(b[x][y].color == "black"):
                    score -= 1

                    if(b[x][y].isKing):
                        score -= .5

        return score

    def find_moves(self, color, b):
        moves = []

        for x in range(8):
            for y in range(8):
                if(b[x][y].color == color):
                    b[x][y].find_moves(b)
                    
                    if(b[x][y].moves != []):
                        for move in b[x][y].moves:
                            newX = move[0]
                            newY = move[1]
                            move_type = move[2]
                            moves.append((x, y, newX, newY, move_type))
                    
                    b[x][y].moves.clear()
        
        return moves

    def minimax(self, fake_board, depth, color, alpha, beta):
        if(depth == 0):
            print(self.score_board(fake_board))
            return self.score_board(fake_board)
        
        if(color == "red"):
            max_score = -100
            moves = self.find_moves(color, fake_board)
            best_move = ()

            for move in moves:
                temp_board = copy.deepcopy(fake_board)
                x = move[0]
                y = move[1]
                
                temp_board[x][y].find_moves(temp_board)
                #print(x, y, temp_board[x][y].moves, depth, color)
                index = temp_board[x][y].moves.index(move[2:])

                temp_board[x][y].move(index, temp_board)
                
                new_board = copy.deepcopy(temp_board)
                new_score = self.minimax(new_board, depth - 1, "black", alpha, beta)

                if(new_score > max_score):
                    max_score = new_score
                    best_move = move

                    if(new_score > alpha):
                        alpha = new_score

                    if(alpha >= beta):
                        break

            if(depth == self.depth):
                return best_move

            return max_score
        else:
            min_score = 100
            moves = self.find_moves(color, fake_board)
            best_move = ()

            for move in moves:
                temp_board = copy.deepcopy(fake_board)
                x = move[0]
                y = move[1]
                
                temp_board[x][y].find_moves(temp_board)
                #print(x, y, temp_board[x][y].moves, depth, color)
                index = temp_board[x][y].moves.index(move[2:])

                temp_board[x][y].move(index, temp_board)
                
                new_board = copy.deepcopy(temp_board)
                new_score = self.minimax(new_board, depth - 1, "red", alpha, beta)

                if(new_score < min_score):
                    min_score = new_score
                    best_move = move

                    if(new_score > alpha):
                        alpha = new_score

                    if(alpha >= beta):
                        break

            if(depth == self.depth):
                return best_move

            return min_score

    def run(self):
        self.thinking = True

        fake_board = copy.deepcopy(board)
        move = self.minimax(fake_board, self.depth, self.color, -100, 100)

        x = move[0]
        y = move[1]
        board[x][y].find_moves(board)
        index = board[x][y].moves.index(move[2:])

        board[x][y].move(index, board)

        self.thinking = False
        global turn
        turn = 1


red = Player("red")
#black = Player("black")
black = Bot()
turn = 1

draw_board()
mainloop()