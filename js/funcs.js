// soundtrack
lofi = document.getElementById('lofi');
lofi.volume = 0.05;
lofi.loop = true;
lofi.play();


//declaração dos canvas
var canvasWidth = 1000;
var canvasHeight = 1000;
var carro_sobe = document.getElementById('carro_sobe');
var carro_desce = document.getElementById('carro_desce');
var backGround = document.getElementById('background');
var topo = document.getElementById('topo');
carro_sobe.width = canvasWidth;
carro_sobe.height = canvasHeight;
carro_desce.width = canvasWidth;
carro_desce.height = canvasHeight;
backGround.width = canvasWidth;
backGround.height = canvasHeight;
topo.width = canvasWidth;
topo.height = canvasHeight;
var ctxCarroSobe = carro_sobe.getContext("2d");
var ctxCarroDesce = carro_desce.getContext("2d");
var ctxBackGround = backGround.getContext("2d");
var ctxTopo = topo.getContext("2d");


//fundos e elementos
var fundo = new Image();
fundo.src = "elements/bg.png";
var pistaTrem = new Image();
pistaTrem.src = "elements/train/pista-trem.png";
var train = new Image();
train.src = "elements/train/trem.png";
var arvores = new Image();
arvores.src = "elements/arvores.png"


//Semaforos
var rSign = new Image();
rSign.src = "signs/redSign.png";
var gSign = new Image();
gSign.src = "signs/greenSign.png";
var ySign = new Image();
ySign.src = "signs/yellowSign.png";
var rSignDeitado = new Image();
rSignDeitado.src = "signs/redSign.png";
var gSignDeitado = new Image();
gSignDeitado.src = "signs/greenSign.png";
var ySignDeitado = new Image();
ySignDeitado.src = "signs/yellowSign.png";


//Carros
var car = new Image();
car.src = "elements/carrinho.png";
var carHorizontal = new Image();
carHorizontal.src = "elements/carrinho2.png";
var carInvert = new Image();
carInvert.src = "elements/carrinho-invert.png";


//Objetos
class Veiculo {
	curve;
	isTurning;
	velo;
	posX;
	posY;
	posYAux;
	sizeX;
	sizeY;
	posXInicial;
	posYInicial;
	constructor(velo, posX, posY, sizeX, sizeY, curve) {
		this.curve = curve;
		this.velo = velo;
		this.posX = posX;
		this.posY = posY;
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.posXInicial = posX;
		this.posYInicial = posY;
	}
}
class Semaforo {
	posX;
	posY;
	sizeX;
	sizeY;
	cor;
	constructor(posX, posY) {
		this.cor = 'Red';
		this.sizeX = 104;
		this.sizeY = 140;
		this.posX = posX;
		this.posY = posY;
	}
}


//variaveis globais
first = true
MotoTranslateX = 315
MotoTranslateY = 480
posXAuxiliarMoto = 0
posYAuxiliarCar = 0
contFimCurvaCar = 0
firstTurnCar = true
count = 0
anguloC = 0
now = Date.now();
nowTrem = now
rdMoto = Math.floor(Math.random() * 10);
rdCar = Math.floor(Math.random() * 10);
angle = 0
i = 1


// inicializando objetos
semA = new Semaforo(555, 710);
carro = new Veiculo(25, 394, 1000, 150, 300);
semB = new Semaforo(335, 435);
moto = new Veiculo(25, -300, 600, 300, 140);
trem = new Veiculo(9, 610, 1200, 269, 1122);


// MAIN FUNC - CONTROLA TODO SISTEMA
function execute() {
	moveCars();
	checkResetVehicle();
}


// loop functions
setTimeout(() => {
	//Controla os semáforos
	initMap();
	setInterval(controlSigns, 500)
}, 50)
setTimeout(() => {
	//Executa a lógica dos carrinhos e de todo ambiente
	setInterval(execute, 15)
}, 1000)


//Functions para fazer as curvas dos elementos
function curveCar() {
	if (isBehindCar()) {
		posicaoYCarro = carro.posY - 0.1 * carro.velo
		ctxCarroDesce.clearRect(0, 0, canvasWidth, canvasHeight);
		ctxCarroDesce.drawImage(car, 394, carro.posY, carro.sizeX, carro.sizeY);
		carro.posY = posicaoYCarro
	}else{
		if(semA.cor == 'Green' && (( !moto.isTurning  && (isMotoFinishing() || isBehindMoto() ))  || moto.isTurning)){
			if (carro.posY >= semA.posY - 120)
				approachCar();
			else
				turnCar();
		}else
			if (carro.posY <= semA.posY - 115){
				turnCar();
			}else
				ctxCarroDesce.drawImage(car, 394, carro.posY, carro.sizeX, carro.sizeY);
	}
}
function turnCar(){
	count++
	ctxCarroDesce.translate(700, 842);
	ctxCarroDesce.clearRect(-700, -756, 2000, 2000);
	
	if(firstTurnCar) {
		ctxCarroDesce.save();
		ctxCarroDesce.rotate(180 * Math.PI/180);
		firstTurnCar = false;
	}
	if(count >= 1 && count < 170){
		ctxCarroDesce.rotate(0.5 * Math.PI/180);
		carro.posX = 156
		carro.posYAux = -50
		ctxCarroDesce.drawImage(carInvert, carro.posX , carro.posYAux, carro.sizeX, carro.sizeY); 
	}
	else if(count >= 170 && count < 180){
		contFimCurvaCar++;
		ctxCarroDesce.rotate(0.55 * Math.PI/180);
		carro.posX = 156-contFimCurvaCar*0.3
		carro.posYAux = -50
		ctxCarroDesce.drawImage(carInvert, carro.posX , carro.posYAux, carro.sizeX, carro.sizeY); 
	}else{
		carRight();
	}
	ctxCarroDesce.translate(-700, -842);
}
function carRight() {
	posYAuxiliarCar = carro.posYAux + 0.1 * carro.velo
	ctxCarroDesce.clearRect(0, 0, canvasWidth, canvasHeight);
	ctxCarroDesce.drawImage(carInvert, carro.posX, posYAuxiliarCar, carro.sizeX, carro.sizeY);
	carro.posYAux = posYAuxiliarCar
}
function approachCar(){
	posicaoYCarro = carro.posY - 0.1 * carro.velo
	ctxCarroDesce.clearRect(0, 0, canvasWidth, canvasHeight);
	ctxCarroDesce.drawImage(car, carro.posX, posicaoYCarro, carro.sizeX, carro.sizeY);
	carro.posY = posicaoYCarro
}
function curveMoto() {
	if (isBehindMoto()) {
		posicaoXMoto = moto.posX + 0.1 * moto.velo
		ctxCarroSobe.clearRect(0, 0, canvasWidth, canvasHeight);
		ctxCarroSobe.drawImage(carHorizontal, moto.posX, moto.posY, moto.sizeX, moto.sizeY);
		moto.posX = posicaoXMoto
	}else{
		if ((semB.cor == 'Green' || moto.posX >= semB.posX - 10)  && (( !carro.isTurning  && (isCarFinishing() || isBehindCar() ))  || carro.isTurning)){
			if (moto.posX <= semB.posX){
				posicaoXMoto = moto.posX + 0.1 * moto.velo
				ctxCarroSobe.clearRect(0, 0, canvasWidth, canvasHeight);
				ctxCarroSobe.drawImage(carHorizontal, moto.posX, moto.posY, moto.sizeX, moto.sizeY);
				moto.posX = posicaoXMoto
			}else{
				i += 0.1
				if (i < 14.15)
					turnMoto();
				else
					motoUp();
			}
		}else
			ctxCarroSobe.drawImage(carHorizontal, moto.posX, moto.posY, moto.sizeX, moto.sizeY);
	}
}
function turnMoto() {
	posXAuxiliar = 21
	moto.posY = 120 + i
	ctxCarroSobe.translate(MotoTranslateX, MotoTranslateY)
	ctxCarroSobe.clearRect(0, 0, canvasWidth, canvasHeight);
	ctxCarroSobe.drawImage(carHorizontal, posXAuxiliar, moto.posY, moto.sizeX, moto.sizeY);
	ctxCarroSobe.rotate(i / 10 * -Math.PI / 200);
	ctxCarroSobe.translate(-MotoTranslateX, -MotoTranslateY)
}
function motoUp() {
	if (first) {
		posXAuxiliarMoto = 20
		ctxCarroSobe.save();
		ctxCarroSobe.translate(MotoTranslateX, MotoTranslateY);
		first = false
	}
	posicaoXMoto = posXAuxiliarMoto + 0.1 * moto.velo
	ctxCarroSobe.clearRect(0, 0, canvasWidth, canvasHeight);
	ctxCarroSobe.drawImage(carHorizontal, posXAuxiliarMoto, moto.posY, moto.sizeX, moto.sizeY);
	posXAuxiliarMoto = posicaoXMoto
}


// CHECK POSITION FUNCS
function checkResetVehicle() {
	checkResetMoto();
	checkResetCar();
	checkResetTrem();
}
function checkResetMoto(){
	if (moto.posX > canvasWidth){
		moto = new Veiculo(30, -300, 600, 300, 140);
		rdMoto = Math.floor(Math.random() * 10);
	}
	else if (posXAuxiliarMoto > 500){
		rdMoto = Math.floor(Math.random() * 10);
		first = true
		ctxCarroSobe.resetTransform()
		i = 1
		posXAuxiliarMoto = 0 
		moto = new Veiculo(30, -300, 600, 300, 140);
	}
}
function checkResetCar(){
	if (!carro.isTurning  && carro.posY < 0 - 200){
		carro = new Veiculo(30, 394, 1000, 150, 300);
		rdCar = Math.floor(Math.random() * 10);
	}else if (posYAuxiliarCar > 400){
		rdCar = Math.floor(Math.random() * 10);
		ctxCarroDesce.resetTransform()
		count = 0
		contFimCurvaCar = 0
		firstTurnCar = true
		posYAuxiliarCar = 0 
		carro = new Veiculo(30, 394, 1000, 150, 300);
	}
}
function checkResetTrem(){
	if (trem.posY < 1125 && Date.now() - nowTrem > 30 * 1000) {
		trem = new Veiculo(9, 610, 1200, 269, 1122);
		nowTrem = Date.now();
	}
}


// BLOCO MOVE'S
function moveCars() {
	clearCtx();
	clearCtxTopo();
	if(rdCar > 4){
		moveCar();
		carro.isTurning = false
	}
	else{
		curveCar();
		carro.isTurning = true
	}
	if(rdMoto > 4){
		moveMoto();
		moto.isTurning = false
	}
	else{
		moto.isTurning = true
		curveMoto();
	}
	moveTrain();
}
function moveTrain() {
	trem.posY = goUp(true)
	ctxTopo.drawImage(train, trem.posX, trem.posY, trem.sizeX, trem.sizeY);
}
function moveCar() {
	ctxCarroDesce.drawImage(car, carro.posX, carro.posY, carro.sizeX, carro.sizeY);
	posicaoYCarro = goUp()
	if ((isBehindCar() && posicaoYCarro >= semA.posY - 20) || checkSign(semA.cor, 'car')) {
		carro.posY = posicaoYCarro
		carro.moving = true
	}
	carro.moving = false
}
function moveMoto() {
	posicaoXMoto = goRight()
	ctxCarroSobe.drawImage(carHorizontal, moto.posX, moto.posY, moto.sizeX, moto.sizeY);
	if ((isBehindMoto() && posicaoXMoto <= semB.posX - 170) || checkSign(semB.cor, 'moto')) {
		moto.posX = posicaoXMoto
		moto.moving = true
	}
	moto.moving = false
}


// FUNCS DIRECIONAIS
function goUp(isTrain) {
	if (!isTrain)
		return carro.posY - 0.1 * carro.velo
	else
		return trem.posY - 0.2 * trem.velo
}
function goRight() {
	return moto.posX + 0.1 * moto.velo
}


// BOOLEAN FUNCS POSICIONAIS
function isBehindCar() {
	return carro.posY >= semA.posY - 20
}
function isBehindMoto() {
	return moto.posX <= semB.posX - 170
}
function isCarFinishing(){
	return carro.posY <= 1.1*canvasHeight/10
}
function isMotoFinishing(){
	return moto.posY >= 8*canvasWidth/10
}


// AUX FUNCS SEMAFORO
function controlSigns() {
	if (compareDate(1, 5.5)) {
		setSign('Green', 'vert')
		semA.cor = 'Green'
		setSign('Red', 'hori')
		semB.cor = 'Red'
	}
	else if (compareDate(5.5, 7) && semB.cor == 'Red') {
		setSign('Yellow', 'vert')
		semA.cor = 'Yellow'
	}
	else if (compareDate(7, 12.5) && semB.cor == 'Red') {
		setSign('Red', 'vert')
		semA.cor = 'Red'
		setSign('Green', 'hori')
		semB.cor = 'Green'
	}
	else if (compareDate(12.5, 14) && semA.cor === 'Red') {
		setSign('Yellow', 'hori')
		semB.cor = 'Yellow'
		now = Date.now()
	}
}
function compareDate(inicio, fim) {
	return Date.now() - now >= inicio * 1000 && Date.now() - now <= fim * 1000
}
function setSign(cor, way) {
	if (way == 'vert') {
		if (cor === 'Yellow')
			ctxBackGround.drawImage(ySign, semA.posX, semA.posY, semA.sizeX, semA.sizeY);
		else if (cor === 'Red')
			ctxBackGround.drawImage(rSign, semA.posX, semA.posY, semA.sizeX, semA.sizeY);
		else if (cor === 'Green')
			ctxBackGround.drawImage(gSign, semA.posX, semA.posY, semA.sizeX, semA.sizeY);
	} else
		if (cor === 'Yellow')
			ctxBackGround.drawImage(ySignDeitado, semB.posX, semB.posY, semB.sizeX, semB.sizeY);
		else if (cor === 'Red')
			ctxBackGround.drawImage(rSignDeitado, semB.posX, semB.posY, semB.sizeX, semB.sizeY);
		else if (cor === 'Green')
			ctxBackGround.drawImage(gSignDeitado, semB.posX, semB.posY, semB.sizeX, semB.sizeY);
}
function checkSign(semaforo, c) {
	if (c == 'car') {
		if (semaforo == 'Green' && (isBehindMoto() || isMotoFinishing()))
			return true
		else if (!isBehindCar())
			return true
		else
			false
	} else {
		if (semaforo == 'Green' && (isBehindCar() || isCarFinishing() || carro.isTurning))
			return true
		else if (!isBehindMoto())
			return true
		else
			return false
	}
}


// FUNCS GRÁFICAS
function initMap() {
	ctxBackGround.drawImage(fundo, 0, 0, 1000, 1000);
	ctxBackGround.drawImage(rSign, semA.posX, semA.posY, semA.sizeX, semA.sizeY);
	ctxBackGround.drawImage(rSignDeitado, semB.posX, semB.posY, semB.sizeX, semB.sizeY);
	ctxTopo.drawImage(pistaTrem, 610, 0, 269, 1000);
	ctxTopo.drawImage(train, trem.posX, trem.posY, trem.sizeX, trem.sizeY);
	ctxTopo.drawImage(arvores, 270, 0, 269, 1000);
	ctxCarroDesce.drawImage(car, carro.posX, carro.posY, carro.sizeX, carro.sizeY);
	ctxCarroSobe.drawImage(carHorizontal, moto.posX, moto.posY, moto.sizeX, moto.sizeY);
}
function clearCtxTopo() {
	ctxTopo.clearRect(610, 0, 630, 1000)
	ctxTopo.drawImage(pistaTrem, 610, 0, 269, 1000);
}
function clearCtx() {
	ctxCarroSobe.clearRect(0, 0, 2*canvasWidth, 2*canvasHeight);
	ctxCarroDesce.clearRect(0, 0, 2*canvasWidth, 2*canvasHeight);
}