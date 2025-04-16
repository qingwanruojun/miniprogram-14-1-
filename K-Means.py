import pandas as pd
import matplotlib
# 读取数据
data = pd.read_excel("")  # 你的数据文件
print("数据预览：")
print(data.head())
print("数据形状：", data.shape)  # (行数, 列数)

from sklearn.preprocessing import StandardScaler

# 进行标准化
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data)

# 转换回 DataFrame 以便查看
data_scaled_df = pd.DataFrame(data_scaled, columns=data.columns)
print("标准化后的数据预览：")
print(data_scaled_df.head())

import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

inertia = []
K_range = range(2, 10)

for k in K_range:
    kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
    kmeans.fit(data_scaled)
    inertia.append(kmeans.inertia_)

matplotlib.rcParams['font.sans-serif'] = ['SimHei']  # 或 'Microsoft YaHei'
matplotlib.rcParams['axes.unicode_minus'] = False  # 解312r2.872.69决负号显示问题
plt.figure(figsize=(8, 5))
plt.plot(K_range, inertia, marker='o')
plt.xlabel('聚类数(K)')
plt.ylabel('惯性')
plt.title('确定最佳 K 值的肘部法则')
plt.show()

# 设定最佳 K 值（假设通过肘部法则确定 k=3）
k = 3
from sklearn.metrics import silhouette_score

# 计算 K=3 和 K=4 的轮廓系数
score_k3 = silhouette_score(data_scaled, KMeans(n_clusters=3, random_state=42, n_init=10).fit_predict(data_scaled))
score_k4 = silhouette_score(data_scaled, KMeans(n_clusters=4, random_state=42, n_init=10).fit_predict(data_scaled))
score_k5 = silhouette_score(data_scaled, KMeans(n_clusters=5, random_state=42, n_init=10).fit_predict(data_scaled))

print(f"K=3 的轮廓系数: {score_k3}")
print(f"K=4 的轮廓系数: {score_k4}")
print(f"K=5 的轮廓系数: {score_k5}")


# 运行 K-Means
kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
clusters = kmeans.fit_predict(data_scaled)

# 添加聚类结果到原始数据
data['Cluster'] = clusters

# 查看每个聚类的人数
print("各类别样本数：")
print(data['Cluster'].value_counts())

from sklearn.decomposition import PCA
import seaborn as sns

# 进行 PCA 降维（降到 2 维，方便可视化）
pca = PCA(n_components=2)
data_pca = pca.fit_transform(data_scaled)

# 创建 DataFrame
pca_df = pd.DataFrame(data_pca, columns=['PCA1', 'PCA2'])
pca_df['Cluster'] = data['Cluster']


matplotlib.rcParams['font.sans-serif'] = ['SimHei']  # 或 'Microsoft YaHei'
matplotlib.rcParams['axes.unicode_minus'] = False  # 解决负号显示问题
# 可视化聚类结果
plt.figure(figsize=(10, 6))
sns.scatterplot(x='PCA1', y='PCA2', hue='Cluster', data=pca_df, alpha=0.7, palette=['red', 'green', 'blue'])
plt.xlabel('主成分1')
plt.ylabel('主成分2')
plt.legend(title='Cluster')
plt.show()


# 计算每个聚类的平均值，查看不同群体的特征
cluster_analysis = data.groupby('Cluster').mean()
print("不同群体的平均特征值：")
print(cluster_analysis)

