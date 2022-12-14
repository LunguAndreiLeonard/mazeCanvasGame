const { Engine, Render, Runner, World, Bodies, Body } = Matter;

const cells = 10;
const width = 600;
const height = 600;

const unitLength = width / cells;

const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
        width,
        height
    }
});
Render.run(render);
Runner.run(Runner.create(), engine);


//walls

const walls = [
    Bodies.rectangle(width / 2, 0, width, 10, {
        isStatic: true
    }),
    Bodies.rectangle(width / 2, height, width, 10, {
        isStatic: true
    }),
    Bodies.rectangle(0, height / 2, 10, height, {
        isStatic: true
    }),
    Bodies.rectangle(width, height / 2, 10, height, {
        isStatic: true
    }),
];
World.add(world, walls);

//maze generation

const shuffle = arr => {
    let counter = arr.length;

    while (counter > 0) {
        const index = Math.floor(Math.random() * counter);

        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }
    return arr;
}

const grid = Array(cells).fill(null).map(() => Array(cells).fill(false));

const verticals = Array(cells)
    .fill(null)
    .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
    .fill(null)
    .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startColumn = Math.floor(Math.random() * cells);

const stepCells = (row, column) => {
    //if i have visited the cell at [row,column], then return
    if (grid[row][column]) {
        return;
    }
    // mark this cell as being visited (din F in T)
    grid[row][column] = true;
    // Assemble randomly-ordered list of neighbors
    const neighbors = shuffle([
        [row - 1, column, 'up'],
        [row, column + 1, 'right'],
        [row + 1, column, 'down'],
        [row, column - 1, 'left']
    ]);
    //For each neighbor....
    for (let neighbor of neighbors) {
        const [nextRow, nextColumn, direction] = neighbor;
        //See if that neighbor is out of bounds
        if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
            continue;
        }
        //If we have visited that neighbor, continue to  next
        if (grid[nextRow][nextColumn]) {
            continue;
        }
        // remove a wall from either horizontals or vertical array
        if (direction === 'left') {
            verticals[row][column - 1] = true;

        } else if (direction === 'right') {
            verticals[row][column] = true;
        } else if (direction === 'up') {
            horizontals[row - 1][column] = true;
        } else if (direction === 'down') {
            horizontals[row][column] = true;
        }
        stepCells(nextRow, nextColumn)
    }
    //Visit that next cell
};

stepCells(startRow, startColumn)

horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        }

        const wall = Bodies.rectangle(
            columnIndex * unitLength + unitLength / 2,
            rowIndex * unitLength + unitLength,
            unitLength,
            10,
            {
                isStatic: true
            }
        );
        World.add(world, wall);
    });
    verticals.forEach((row, rowIndex) => {
        row.forEach((open, columnIndex) => {
            if (open) {
                return;
            }

            const wall = Bodies.rectangle(
                columnIndex * unitLength + unitLength,
                rowIndex * unitLength + unitLength / 2,
                10,
                unitLength,
                {
                    isStatic: true
                }
            );
            World.add(world, wall);
        })
    })
})
//GOAL

const goal = Bodies.rectangle(
    width - unitLength / 2,
    height - unitLength / 2,
    unitLength * .7,
    unitLength * .7,
    {
        isStatic: true
    }
);
World.add(world, goal);


// ball

const ball = Bodies.circle(
    unitLength / 2,
    unitLength / 2,
    unitLength / 4
);
World.add(world, ball);

document.addEventListener('keydown', event => {
    const { x, y } = ball.velocity;

    if (event.code === 'KeyW') {
        Body.setVelocity(ball, { x, y: y - 5 })
    }
    if (event.code === 'KeyD') {
        Body.setVelocity(ball, { x: x + 5, y })
    }
    if (event.code === 'KeyS') {
        Body.setVelocity(ball, { x, y: y + 5 })
    }
    if (event.code === 'KeyA') {
        Body.setVelocity(ball, { x: x - 5, y })
    }
})

Events.on(engine, 'collisionStart', event => {

})


