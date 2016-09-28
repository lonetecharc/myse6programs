import gulp from 'gulp';
import shell from 'gulp-shell';
import rimraf from 'rimraf';
import run from 'run-sequence';
import watch from 'gulp-watch';
import server from 'gulp-live-server';

const paths = {
    js:['./src/**/*.js'],
    destination: './app'
};

gulp.task('default', cb => {
    run('server','build','watch',cb);
});

gulp.task('copy', () => {
    return gulp
        .src('./src/**/*.html')
        .pipe(gulp.dest(paths.destination));
});

gulp.task('clean', cb => {
    rimraf(paths.destination,cb);
});

gulp.task('flow',shell.task([
    'flow'
],{ ignoreErrors:true }));

gulp.task('babel',shell.task([
    'babel src --out-dir app'
]));

gulp.task('babel-routes',shell.task([
    'babel src/routes --out-dir app/routes'
]));



gulp.task('build', cb => {
    run('clean','flow', 'babel', 'babel-routes' ,'copy' ,'restart', cb);
});

gulp.task('watch',() => {
    return watch(paths.js,()=>{
        gulp.start('build');
    });
});

let express;

gulp.task('server',() => {
    express = server.new(paths.destination);
});

gulp.task('restart',() => {
    express.start.bind(express)();
});