<template>
	<view class="container">

		<!-- 视频控件 -->
		<view class="video-pannel">
			<video class="video-pannel-video" autoplay="true" @ended="playNext()" :src="playingItem.mv"> </video>
		</view>
		
		<view class="playing-item">
			<view>
				<image :src="playingItem.albumPic"
					style="width: 128rpx; height: 128rpx; background-color: #0099BC; border-radius: 20rpx;"></image>
			</view>
			<view class="playing-label">
				<view>{{playingItem.songName}}</view>
				<view>{{playingItem.auth}}</view>
				<view>{{playingItem.album}}</view>
			</view>

		</view>

		<view class="list-title"> | 播放列表 </view>
		<view class="musiclist-btns">
			<button class="musiclist-btn" v-if="playRandom == true" @click="changePlayMod()"
				style="background-color: #7CCD7D;">随机:开</button>
			<button class="musiclist-btn" v-if="playRandom == false" @click="changePlayMod()">随机:关</button>
			<button class="musiclist-btn" @click="playNext()">下一首</button>
			<button class="musiclist-btn" style="background-color: #FFC043;" @click="removeAll()">清空</button>
		</view>

		<view scroll-y="true" class="music-list">

			<view class="music-list-item" v-for="(item, index) in playingList.songs" :key="index">
				<view class="music-list-item-text" @click="play(index)">
					{{index + 1}}.
					<text>{{item.name}}</text>
				</view>
				<view class="music-list-btn" wx:if="{{item.mv > 0}}">
					<label @click="removeItem(index)">x</label>
				</view>
			</view>

		</view>

	</view>
</template>

<script>
	import {
		getPlayingList,
		saveData,
		getData,
		getRequest,
		savePlayingList
	} from "../../utils/utils.js"
	export default {
		data() {
			return {
				playingItem: {
					songName: "当前无播放",
					auth: "",
					album: "",
					albumPic: "",
					index: -1,
					mv: ""
				},
				playRandom: false,
				playingList: {
					songs: [],
					songIds: [],
				}
			}
		},
		onLoad() {

		},
		onShow() {
			getPlayingList().then(data => {
				this.playingList = {
					songs: data.songs,
					songIds: data.songIds
				}
			})
		},
		methods: {
			play(index) {
				const songItem = this.playingList.songs[index]
				let auth = songItem.ar.map(auth => auth.name).join(' / ')

				let url = `/mv/url?id=${songItem.mv}`
				getRequest(url, null).then(res => {
					this.playingItem = {
						songName: songItem.name,
						auth: auth,
						album: songItem.al.name,
						albumPic: songItem.al.picUrl,
						mv: res.data.data.url,
						index: index
					}
				})
			},
			changePlayMod() {
				this.playRandom = !this.playRandom
			},
			playNext() {
				let playListSize = this.playingList.songs.length
				let index = this.playingItem.index
				if (this.playRandom) {
					index = Math.floor(Math.random() * playListSize)
				} else {
					index = index + 1
					if (index === playListSize) {
						index = 0
					}
				}
				this.play(index)
			},
			removeItem(index) {
				let songs = this.playingList.songs
				let songIds = this.playingList.songIds
				songs.splice(index, 1)
				songIds.splice(index, 1)
				this.playingList = {
					songs: songs,
					songIds: songIds
				}
				savePlayingList(songs, songIds)

			},
			removeAll() {
				savePlayingList([], [])
				this.playingList = {
					songs: [],
					songIds: []
				}
				this.playingItem = {
					songName: "",
					auth: "",
					album: "",
					albumPic: "",
					index: -1,
					mv: ""
				}
			}

		}
	}
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	.logo {
		height: 200rpx;
		width: 200rpx;
		margin-top: 200rpx;
		margin-left: auto;
		margin-right: auto;
		margin-bottom: 50rpx;
	}

	.text-area {
		display: flex;
		justify-content: center;
	}

	.title {
		font-size: 36rpx;
		color: #8f8f94;
	}

	.video-pannel {
		width: 100%;
		align-items: center;
		text-align: center;
	}

	.video-pannel-video {
		width: 98%;
		border-radius: 20rpx;
	}

	.playing-item {
		width: 95%;
		text-align: left;
		display: inline-flex;
	}

	.playing-label {
		padding: 0rpx 10rpx 0rpx 15rpx;
	}

	.music-list-btn {
		background-color: #FF7043;
	}

	.playing-list {
		text-align: left;
		top: 450rpx;
		overflow: auto;
		width: 90%;
	}
</style>