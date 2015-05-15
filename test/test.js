var foo = 1;

function bar() {
    var foo;

    if (!foo) {
        foo = 10;
    }

    console.log(foo);
}

bar();


