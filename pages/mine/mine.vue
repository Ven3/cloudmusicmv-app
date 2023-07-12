<template>
	<view class="container">
		<view class="user-info">
			<view>
				<image :src="userInfo.avatarUrl"></image>
			</view>
			<view style="width: 100%; display: inline-flex;">
				<view class="info-label">
					<view>{{userInfo.nickname}}</view>
					<view>{{userInfo.signature}}</view>
					<view v-if="userInfo.level > 0">Lv.{{userInfo.level}}</view>
				</view>
				<view class="info-btns">
					<label v-if="userInfo.loginState == true" @click="logout()">注销</label>
					<label v-if="userInfo.loginState != true" @click="goLogin()">登录</label>
				</view>
			</view>

		</view>

		<view class="list-title">| 我的歌单</view>


		<scroll-view scroll-x="true" class="playlist-list">
			<view class="playlist-list-item" @click="switchAlbum(item.id)" v-for="(item, index) in  playlist"
				:key="index">
				<image class="playlist-list-image" :src="item.coverImgUrl"></image>
				<view class="playlist-list-text">{{item.name}}</view>
			</view>
		</scroll-view>


		<view class="list-title"> | 歌曲列表 </view>
		<view class="musiclist-btns">
			<button class="musiclist-btn" v-if="showMod == true" @click="changeShowMod()"
				style="background-color: #7CCD7D;">MV</button>
			<button class="musiclist-btn" v-if="showMod == false" @click="changeShowMod()">MV</button>
			<button class="musiclist-btn" @click="addAllToPlay()">添加播放</button>
		</view>





		<view class="music-list">
			
			<view class="music-list-item" v-for="(item, index) in showlist" :key="index">
				<view class="music-list-item-text" >
					{{index + 1}}.
					<text>{{item.name}}</text>
				</view>
				<view class="music-list-btn" v-if="item.mv > 0">
					<label @click="addToPlay(index)">+</label>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		saveData,
		getData,
		getRequest,
		getPlayingList,
		savePlayingList
	} from '../../utils/utils'
	export default {
		data() {
			return {
				userInfo: {
					loginState: false,
					nickname: "",
					avatarUrl: "../../static/img/mine-active.png",
					signature: "",
					userId: 0,
					level: 0,
				},
				playlist: [],
				musiclist: [],
				mvlist: [],
				showlist: [],
				showMod: false,
			}
		},
		onShow() {
			getData("userInfo").then(data => {
				if (data.userId > 0 && !this.userInfo.loginState) {
					this.userInfo = data
					this.userInfo.loginState = true
					this.loadUserPlayList(data.userId)
				}
			})

			if (!this.userInfo.loginState) {
				this.loadHotPlayList()
			}
		},
		methods: {

			/**
			 * 获取用户歌单
			 */
			loadUserPlayList(userId) {
				let url = `/user/playlist?uid=${userId}`

				getRequest(url, null).then(res => {
					this.playlist = res.data.playlist
					if (this.playlist.length > 0) {
						this.switchAlbum(this.playlist[0].id)
					}
				})
			},
			loadHotPlayList() {
				getRequest("/top/playlist/highquality?limit=10", null).then(res => {
					this.playlist = res.data.playlists

					if (this.playlist.length > 0) {
						this.switchAlbum(this.playlist[0].id)
					}
				})
			},

			switchAlbum(playlistId) {
				let url = `/playlist/track/all?id=${playlistId}&limit=100&offset=1`
				getRequest(url, null).then(res => {
					let mvlist = res.data.songs.filter(song => song.mv > 0)
					let showlist = this.showMod == true ? mvlist : res.data.songs
					this.musiclist = res.data.songs
					this.mvlist = mvlist
					this.showlist = showlist
				}).catch(err => {
					console.log(err)
				})
			},

			changeShowMod() {
				let showMod = !this.showMod
				let showlist
				if (showMod) {
					showlist = this.mvlist
				} else {
					showlist = this.musiclist
				}

				this.showMod = showMod
				this.showlist = showlist
			},
			addToPlay(index) {

				getPlayingList().then(data => {
					let playinglist = data
					let item = this.showlist[index]

					if (!playinglist.songIds.includes(item.id)) {
						data.songs.push(item)
						data.songIds.push(item.id)

						savePlayingList(data.songs, data.songIds)
					} else {
						console.log("歌曲已添加")
					}
				})



			},
			addAllToPlay() {

				getPlayingList().then(res => {
					let songs = res ? res.songs : [];
					let songIds = res ? res.songIds : []
					if (songs.length == 0 || songIds.length == 0) {
						console.log("全量添加")
						songs = this.mvlist
						songIds = this.mvlist.map(item => item.id)
					} else {
						for (let index in this.mvlist) {
							let item = this.mvlist[index]
							if (songIds.includes(item.id)) {
								console.log("歌曲已添加")
							} else {
								songs.push(item)
								songIds.push(item.id)
							}
						}
					}
					saveData("playinglist", {
						"songs": songs,
						"songIds": songIds
					})
				})

			},
			logout() {
				this.userInfo = {}

				saveData("userInfo", {})
				this.loadHotPlayList()
			},

			goLogin() {

				uni.navigateTo({
					url: "../login/login",
					success: res => {
						console.log(res)
					},
					fail: err => {
						console.log(err)
					}
				})
			}
		}
	}
</script>

<style>
	.user-info {
		text-align: left;
		width: 100%;
		display: inline-flex;
	}

	.info-label {
		width: 80%;
		margin: 0 10rpx 0 10rpx;
	}

	.info-btns {
		width: 20%;
		margin-top: 20rpx;
		background-color: lightgray;
		text-align: center;
		height: 60rpx;
		padding-top: 10rpx;
		border-radius: 20rpx;
	}

	.user-info image {
		background-color: #0099BC;
		width: 128rpx;
		height: 128rpx;
		border-radius: 64rpx;
	}

	.playlist-list {
		width: 100%;
		white-space: nowrap;
	}

	.playlist-list-item {
		display: inline-block;
		width: 185rpx;
		text-overflow: ellipsis;
		padding: 10rpx;
		text-align: center;
	}

	.playlist-list-image {
		width: 180rpx;
		height: 180rpx;
		border-radius: 20rpx;
	}

	.playlist-list-text {
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.playlist-list view text {
		/* font-size: 20rpx; */
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>