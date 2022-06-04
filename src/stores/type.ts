export interface ShowAddSwitch {
	all: boolean;
	suspect: boolean;
	nowConfirm: boolean;
	nowSevere: boolean;
	importedCase: boolean;
	localConfirm: boolean;
	localinfeciton: boolean;
	confirm: boolean;
	dead: boolean;
	heal: boolean;
	noInfect: boolean;
}

export interface Today {
	isUpdated: boolean;
	confirm: number;
}

export interface Total {
	nowConfirm: number;
	dead: number;
	heal: number;
	confirm: number;
	showHeal: boolean;
	provinceLocalConfirm: number;
	mtime: string;
	adcode: string;
	showRate: boolean;
	wzz: number;
	continueDayZeroLocalConfirmAdd: number;
	mediumRiskAreaNum: number;
	highRiskAreaNum: number;
	continueDayZeroLocalConfirm: number;
}

export interface Today {
	local_confirm_add: number;
	abroad_confirm_add: number;
	dead_add: number;
	confirm: number;
	confirmCuts: number;
	isUpdated: boolean;
	tip: string;
	wzz_add: number;
}

export interface Total {
	showRate: boolean;
	showHeal: boolean;
	continueDayZeroConfirmAdd: number;
	mtime: string;
	dead: number;
	mediumRiskAreaNum: number;
	provinceLocalConfirm: number;
	highRiskAreaNum: number;
	nowConfirm: number;
	confirm: number;
	continueDayZeroConfirm: number;
	continueDayZeroLocalConfirmAdd: number;
	adcode: string;
	heal: number;
	wzz: number;
}

export interface Today {
	wzz_add: number;
	local_confirm_add: number;
	confirm: number;
	confirmCuts: number;
	isUpdated: boolean;
}

export interface Total {
	adcode: string;
	confirm: number;
	showRate: boolean;
	continueDayZeroLocalConfirmAdd: number;
	mtime: string;
	nowConfirm: number;
	mediumRiskAreaNum: number;
	highRiskAreaNum: number;
	continueDayZeroLocalConfirm: number;
	showHeal: boolean;
	wzz: number;
	provinceLocalConfirm: number;
	dead: number;
	heal: number;
}

export interface Children {
	adcode: string;
	date: string;
	today: Today;
	total: Total;
	name: string;
}

export interface Children {
	name: string;
	adcode: string;
	date: string;
	today: Today;
	total: Total;
	children: Children[];
}

export interface AreaTree {
	name: string;
	today: Today;
	total: Total;
	children: Children[];
}

export interface ChinaTotal {
	showlocalinfeciton: number;
	deadAdd: number;
	dead: number;
	importedCase: number;
	noInfectH5: number;
	localConfirmH5: number;
	localWzzAdd: number;
	confirm: number;
	nowSevere: number;
	local_acc_confirm: number;
	confirmAdd: number;
	nowLocalWzz: number;
	mtime: string;
	localConfirmAdd: number;
	suspect: number;
	noInfect: number;
	mediumRiskAreaNum: number;
	highRiskAreaNum: number;
	nowConfirm: number;
	localConfirm: number;
	mRiskTime: string;
	heal: number;
	showLocalConfirm: number;
}

export interface ChinaAdd {
	localConfirm: number;
	noInfectH5: number;
	suspect: number;
	importedCase: number;
	noInfect: number;
	nowConfirm: number;
	nowSevere: number;
	localConfirmH5: number;
	confirm: number;
	heal: number;
	dead: number;
}

export interface Diseaseh5Shelf {
	isShowAdd: boolean;
	showAddSwitch: ShowAddSwitch;
	areaTree: AreaTree[];
	lastUpdateTime: string;
	chinaTotal: ChinaTotal;
	chinaAdd: ChinaAdd;
}

export interface LocalCityNCOVDataList {
	province: string;
	date: string;
	isUpdated: boolean;
	mtime: string;
	local_confirm_add: number;
	isSpecialCity: boolean;
	city: string;
	adcode: string;
	local_wzz_add: string;
	mediumRiskAreaNum: number;
	highRiskAreaNum: number;
}

export interface RootObject {
	diseaseh5Shelf: Diseaseh5Shelf;
	localCityNCOVDataList: LocalCityNCOVDataList[];
}