# recommendation_system
### 机器学习[推荐系统]

+ 基于[Book-Crossing Dataset](http://www2.informatik.uni-freiburg.de/~cziegler/BX/)数据集
+ 由于当中的数据集对书本的主题没有挖掘下来，所以参数特征以年龄层为特征，将来找到更好的数据将会更改特征
+ 语言采用nodejs(javascript)
+ 针对Andrew NG机器学习教程 lecture17推荐系统的小成品

#### 结构
```
package.json 用于定义项目信息与npm加载依赖
src/
  |——file.js 用于加载csv文件、编写激活函数sigmoid()、代价函数J()、梯度下降函数gradient_descent()、人-书最相关函数relative()
  |——matrix.js 用于提供矩阵变换的函数(包括了转置函数、矩阵乘法、计算矩阵行或列平均值/求和/方差、求向量欧氏距离等)
index.js 用于加载file.js 与 matrix.js 的功能，并用于推荐算法
```

