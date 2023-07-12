<template>
	<view class="container">

		<view class="ctrl-item">
			<textarea class="content" @input="userLink = $event.detail.value" auto-focus="true"
				placeholder="请在这里粘贴链接"></textarea>
		</view>

		<view class="ctrl-item">
			<text v-if="result.state == 500" style="color: red;">{{result.message}}</text>
			<text v-if="result.state === 200" style="color: green;">{{result.message}}</text>
		</view>
		<!-- 解析数据 -->
		<view class="ctrl-item" v-if="userInfo.userId > 0" style="display: inline-flex; width: 90%; text-align: left;">
			<view>
				<image class="user-avatar" :src="userInfo.avatarUrl"></image>
			</view>
			<view style="width: 100%; display: inline-flex;">
				<view class="info-label">
					<view> 用户名: {{userInfo.nickname}}</view>
					<view> 个性签名: {{userInfo.signature}}</view>
					<view> 用户等级: {{userInfo.level}}</view>
				</view>
			</view>
		</view>
		<!-- 按钮 -->
		<view class="ctrl-item">
			<button @click="getUserInfo" v-if="userInfo.userId == 0">开始解析</button>
			<button @click="linkUser" :disabled="result.state == 200" class="bg-success"
				v-if="userInfo.userId > 0">确认关联</button>
		</view>

		<view class="music-list">
			<label class="list-title">| 使用帮助</label>
		</view>
		<view class="music-list">
			<view>如何关联网易云音乐账号?</view>
			<view>1. 打开"网易云音乐APP";</view>
			<view>2. 导航栏点击"我的";</view>
			<view>3. 点击顶部用户头像进入到个人主页; </view>
			<view>4. 点击右上角三个点, 在弹出的菜单栏中选择"分享"; </view>
			<view>5.分享方式选择"复制链接";</view>
			<view>6. 然后将链接粘贴在上方的编辑区域; </view>
			<view>7. 点击开始解析, 如果解析成功的话, 会显示你的个人头像, 用户名等信息;</view>
			<view>8. 解析完成之后会出现"确认关联"按钮, 点击"确认关联", 即可完成云音乐账号关联;</view>
		</view>

		<view style="width: 100%;">
			<button class="bg-success" @click="seeAbout()">关于</button>
			<button class="bg-success">使用说明</button>

		</view>

	</view>
</template>

<script>
	import {
		saveData,
		getData,
		getRequest
	} from '../../utils/utils.js'
	export default {
		data() {
			return {
				userLink: "",
				result: {
					state: 0,
					message: ""
				},
				userInfo: {
					loginState: false,
					userId: 0,
					nickname: "",
					level: 0,
					signature: "",
					avatarUrl: ""
				}
			}
		},
		methods: {
			getUserInfo() {
				console.log(this.userLink)
				var reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
				let userlink = this.userLink.match(reg)
				if (userlink == null) {
					this.result.state = 500
					this.result.message = "未获取到用户主页链接"
					return
				}

				let userId
				try {
					let params = userlink.toString().split("?")[1].split("&")
					for (let key in params) {
						if (params[key].startsWith("id=")) {
							userId = params[key].replace("id=", "")
						}
					}
				} catch (err) {
					console.log(err)
					this.result.state = 500
					this.result.message = "用户主页链接解析失败, 请重试"
				}

				getRequest(`/user/detail?uid=${userId}`, null).then(res => {
					console.log(res)

					this.result = {
						state: 0,
						message: ""
					}
					this.userInfo = {
						userId: userId,
						nickname: res.data.profile.nickname,
						level: res.data.level,
						signature: res.data.profile.signature,
						avatarUrl: res.data.profile.avatarUrl
					}

				}).catch(err => {
					this.result = {
						state: 500,
						message: "获取用户数据出错"
					}

				})
			},
			updateUserLink(e) {
				console.log(e)
			},
			linkUser() {
				saveData("userInfo", this.userInfo)
				this.result = {
					state: 200,
					message: "关联完成"
				}

			},
			seeAbout() {
				uni.navigateTo({
					url: "../about/about",
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
	.content {
		border: lightgrey solid;
		border-radius: 20rpx;
		padding: 20rpx;
	}

	.ctrl-item {
		margin-top: 10rpx;
	}

	.user-info {
		text-align: left;
		width: 100%;
		display: inline-flex;
	}

	.info-label {
		width: 80%;
		margin: 0 10rpx 0 10rpx;
	}

	.user-avatar {
		background-color: #0099BC;
		width: 128rpx;
		height: 128rpx;
		border-radius: 64rpx;
	}

	.bg-success {
		margin: 10rpx;
	}
</style>